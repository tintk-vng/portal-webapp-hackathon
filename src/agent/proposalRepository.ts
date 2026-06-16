import fs from 'fs'
import path from 'path'
import { getItemById, resolveGameToPublisher } from '@/src/data/catalog'
import { validateCampaignData } from '@/src/data/campaigns'
import { proposalToCampaign } from './proposalAdapters'
import { DraftCampaignProposal, DraftCampaignProposalStatus } from './types'

const proposalDirectory = path.join(process.cwd(), 'src', 'agent', 'proposals')

function isSafeProposalId(proposalId: string) {
  return /^[a-z0-9][a-z0-9-]*$/.test(proposalId)
}

export function getProposalPath(proposalId: string) {
  if (!isSafeProposalId(proposalId)) {
    return undefined
  }

  return path.join(proposalDirectory, `${proposalId}.json`)
}

export function listCampaignProposalIds() {
  if (!fs.existsSync(proposalDirectory)) {
    return []
  }

  return fs
    .readdirSync(proposalDirectory)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''))
}

export function getCampaignProposal(proposalId: string): DraftCampaignProposal | undefined {
  const proposalPath = getProposalPath(proposalId)

  if (!proposalPath || !fs.existsSync(proposalPath)) {
    return undefined
  }

  return JSON.parse(fs.readFileSync(proposalPath, 'utf8')) as DraftCampaignProposal
}

export function saveCampaignProposal(proposal: DraftCampaignProposal) {
  const proposalPath = getProposalPath(proposal.id)

  if (!proposalPath) {
    throw new Error(`Invalid proposal id: ${proposal.id}`)
  }

  fs.writeFileSync(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`, 'utf8')
  return proposal
}

export function updateCampaignProposalStatus(proposalId: string, status: DraftCampaignProposalStatus) {
  const proposal = getCampaignProposal(proposalId)

  if (!proposal) {
    throw new Error(`Proposal not found: ${proposalId}`)
  }

  return saveCampaignProposal({
    ...proposal,
    status
  })
}

export function validateCampaignProposal(proposal: DraftCampaignProposal) {
  const errors: string[] = []
  const proposalRecord = proposal as unknown as Record<string, unknown>
  const publisher = getItemById(proposal.targetPublisherId)

  if (typeof proposalRecord.targetPublisherId !== 'string' || Array.isArray(proposalRecord.targetPublisherId)) {
    errors.push('targetPublisherId must be one publisher/store id string')
  }

  if (Array.isArray(proposalRecord.targetPublisherIds) || Array.isArray(proposalRecord.targetPublishers)) {
    errors.push('proposal must not contain multiple publisher targets')
  }

  if (!publisher || (publisher.type !== 'publisher' && publisher.type !== 'store')) {
    errors.push(`targetPublisherId does not exist or is not a publisher/store: ${proposal.targetPublisherId}`)
  }

  for (const gameId of proposal.targetGameIds) {
    if (getItemById(gameId)?.type !== 'game') {
      errors.push(`targetGameIds contains an invalid game id: ${gameId}`)
    } else if (resolveGameToPublisher(gameId)?.id !== proposal.targetPublisherId) {
      errors.push(`targetGameId ${gameId} does not map to selected publisher/store ${proposal.targetPublisherId}`)
    }
  }

  if (!Number.isFinite(proposal.discountPercent) || proposal.discountPercent <= 0 || proposal.discountPercent >= 100) {
    errors.push('discountPercent must be a positive number below 100')
  }

  for (const item of proposal.recommendedPopularSearchItems) {
    const target = getItemById(item.targetId)

    if (!target) {
      errors.push(`recommendedPopularSearchItems targetId does not exist: ${item.targetId}`)
    } else if (target.type !== item.targetType) {
      errors.push(`recommendedPopularSearchItems targetType mismatch for ${item.targetId}`)
    }
  }

  for (const result of validateCampaignData([proposalToCampaign(proposal)])) {
    errors.push(...result.errors)
  }

  return errors
}
