import fs from 'fs'
import path from 'path'
import { campaigns } from './campaigns'

function getCampaignStatePath() {
  return path.join(process.cwd(), 'src', 'agent', 'campaignState.json')
}

export function loadCampaignState(): { disabledCampaigns: string[] } {
  try {
    const raw = fs.readFileSync(getCampaignStatePath(), 'utf8')
    return JSON.parse(raw)
  } catch {
    return { disabledCampaigns: [] }
  }
}

function writeCampaignState(state: { disabledCampaigns: string[] }) {
  fs.writeFileSync(getCampaignStatePath(), JSON.stringify(state, null, 2))
}

export function disableCampaign(campaignId: string) {
  const campaign = campaigns.find(c => c.id === campaignId)
  if (campaign) campaign.enabled = false
  const state = loadCampaignState()
  if (!state.disabledCampaigns.includes(campaignId)) {
    state.disabledCampaigns.push(campaignId)
    writeCampaignState(state)
  }
}
