import { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import path from 'path'
import { getActiveCampaign, setTopBanner, unsetTopBanner, campaigns } from '@/src/data/campaigns'
import {
  listCampaignProposalIds,
  getCampaignProposal,
  updateCampaignProposalStatus,
  saveCampaignProposal
} from '@/src/agent/proposalRepository'
import { DraftCampaignProposalStatus } from '@/src/agent/types'

function addStatusHistory(proposal: any, newStatus: DraftCampaignProposalStatus) {
  const history = Array.isArray(proposal.statusHistory) ? [...proposal.statusHistory] : []
  history.push({ status: newStatus, timestamp: new Date().toISOString() })
  return history
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  try {
    if (method === 'GET') {
      const activeCampaign = getActiveCampaign()
      const proposalIds = listCampaignProposalIds()
      const proposals = proposalIds
        .map((id) => getCampaignProposal(id))
        .filter(Boolean)

      // Find top banner campaign
      const topBannerCampaign = campaigns.find((c) => c.enabled && c.isTopBanner) || activeCampaign

      // Get live campaigns (enabled ones)
      const liveCampaigns = campaigns.filter((c) => c.enabled)

      return res.status(200).json({
        activeCampaign,
        topBannerCampaign,
        liveCampaigns,
        proposals
      })
    }

    if (method === 'POST') {
      const { action, proposalId, campaignId } = req.body

      if (!action) {
        return res.status(400).json({ error: 'Missing action parameter' })
      }

      if (action === 'scan') {
        const scriptPath = path.join(process.cwd(), 'scripts', 'generateWeeklyCampaignProposal.js')
        return new Promise<void>((resolve, reject) => {
          // Run the weekly campaign proposal generator with research scanning
          exec(`node ${scriptPath} --run-research`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Scan failed: ${error.message}\n${stderr}`)
              res.status(500).json({ error: 'Failed to run campaign scan', details: error.message, stderr })
              return resolve()
            }
            console.log(`Scan output: ${stdout}`)

            // Update newly created proposals to 'scanned' status with lastScannedAt
            const proposalIds = listCampaignProposalIds()
            const now = new Date().toISOString()
            for (const id of proposalIds) {
              const proposal = getCampaignProposal(id)
              if (proposal && proposal.status === 'draft' && !proposal.lastScannedAt) {
                proposal.status = 'scanned'
                proposal.lastScannedAt = now
                proposal.statusHistory = addStatusHistory(proposal, 'scanned')
                saveCampaignProposal(proposal)
              }
            }

            res.status(200).json({ status: 'success', message: 'Scan completed successfully', stdout })
            return resolve()
          })
        })
      }

      // Actions that need proposalId
      if (action === 'acknowledge' || action === 'approve' || action === 'reject' || action === 'apply' || action === 'revert' || action === 'update' || action === 'enrich-content') {
        if (!proposalId) {
          return res.status(400).json({ error: 'Missing proposalId parameter' })
        }
      }

      if (action === 'acknowledge') {
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        if (proposal.status !== 'scanned') {
          return res.status(400).json({ error: 'Only scanned proposals can be acknowledged' })
        }
        proposal.status = 'draft'
        proposal.statusHistory = addStatusHistory(proposal, 'draft')
        saveCampaignProposal(proposal)
        return res.status(200).json({ status: 'success', proposal })
      }

      if (action === 'revert') {
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        if (proposal.status !== 'rejected') {
          return res.status(400).json({ error: 'Only rejected proposals can be reverted to draft' })
        }
        proposal.status = 'draft'
        proposal.statusHistory = addStatusHistory(proposal, 'draft')
        saveCampaignProposal(proposal)
        return res.status(200).json({ status: 'success', proposal })
      }

      if (action === 'set-top-banner') {
        if (!campaignId) {
          return res.status(400).json({ error: 'Missing campaignId parameter' })
        }
        const alreadyActive = campaigns.find((c) => c.isTopBanner && c.id === campaignId)
        if (alreadyActive) {
          unsetTopBanner()
        } else {
          setTopBanner(campaignId)
        }
        const activeCampaign = getActiveCampaign()
        return res.status(200).json({ status: 'success', activeCampaign })
      }

      if (action === 'update') {
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }

        const {
          bannerTitle,
          bannerSubtitle,
          bannerImageUrl,
          mobileBannerImageUrl,
          coverImageUrl,
          articleTitle,
          articleSummary,
          articleContent
        } = req.body

        const updatedProposal = {
          ...proposal,
          bannerTitle: bannerTitle ?? proposal.bannerTitle,
          bannerSubtitle: bannerSubtitle ?? proposal.bannerSubtitle,
          bannerImageUrl: bannerImageUrl ?? proposal.bannerImageUrl,
          mobileBannerImageUrl: mobileBannerImageUrl ?? proposal.mobileBannerImageUrl,
          coverImageUrl: coverImageUrl ?? proposal.coverImageUrl,
          articleTitle: articleTitle ?? proposal.articleTitle,
          articleSummary: articleSummary ?? proposal.articleSummary,
          articleContent: articleContent ?? proposal.articleContent
        }

        const { validateCampaignProposal } = require('@/src/agent/proposalRepository')
        updatedProposal.validationWarnings = validateCampaignProposal(updatedProposal)

        saveCampaignProposal(updatedProposal)
        return res.status(200).json({ status: 'success', proposal: updatedProposal })
      }

      if (action === 'enrich-content') {
        if (!proposalId) {
          return res.status(400).json({ error: 'Missing proposalId parameter' })
        }
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        const scriptPath = path.join(process.cwd(), 'scripts', 'enrichArticleContent.js')
        return new Promise<void>((resolve) => {
          exec(`node ${scriptPath} ${proposalId}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Enrich failed: ${error.message}\n${stderr}`)
              res.status(500).json({ error: 'Content enrichment failed', details: error.message, stderr })
              return resolve()
            }
            const updated = getCampaignProposal(proposalId)
            res.status(200).json({ status: 'success', message: 'Nội dung đã được cập nhật từ nguồn chính thức.', proposal: updated, stdout })
            return resolve()
          })
        })
      }

      if (action === 'approve') {
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        proposal.status = 'approved'
        proposal.statusHistory = addStatusHistory(proposal, 'approved')
        saveCampaignProposal(proposal)
        return res.status(200).json({ status: 'success', proposal })
      }

      if (action === 'reject') {
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        proposal.status = 'rejected'
        proposal.statusHistory = addStatusHistory(proposal, 'rejected')
        saveCampaignProposal(proposal)
        return res.status(200).json({ status: 'success', proposal })
      }

      if (action === 'apply') {
        // Ensure proposal is approved first before applying
        const proposal = getCampaignProposal(proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }

        if (proposal.status !== 'approved' && proposal.status !== 'applied') {
          proposal.status = 'approved'
          proposal.statusHistory = addStatusHistory(proposal, 'approved')
          saveCampaignProposal(proposal)
        }

        const cleanEnv = { ...process.env }
        for (const key of Object.keys(cleanEnv)) {
          if (key.startsWith('__NEXT') || key === 'NODE_OPTIONS') {
            delete cleanEnv[key]
          }
        }
        cleanEnv.NODE_ENV = 'production'
        cleanEnv.SKIP_LOCAL_SERVER_RESTART = '1'

        const scriptPath = path.join(process.cwd(), 'scripts', 'applyApprovedCampaignProposal.js')
        return new Promise<void>((resolve, reject) => {
          exec(`node ${scriptPath} ${proposalId}`, { env: cleanEnv }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Apply failed: ${error.message}\n${stderr}`)
              res.status(500).json({ error: 'Failed to apply campaign', details: error.message, stderr })
              return resolve()
            }
            console.log(`Apply output: ${stdout}`)

            // Update status history
            const updatedProposal = getCampaignProposal(proposalId)
            if (updatedProposal) {
              updatedProposal.status = 'applied'
              updatedProposal.statusHistory = addStatusHistory(updatedProposal, 'applied')
              saveCampaignProposal(updatedProposal)
            }

            res.status(200).json({ status: 'success', message: 'Campaign applied successfully', stdout })
            return resolve()
          })
        })
      }

      return res.status(400).json({ error: 'Invalid action' })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: `Method ${method} Not Allowed` })
  } catch (error: any) {
    console.error('Error handling campaign API:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
