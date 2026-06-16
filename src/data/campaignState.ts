import fs from 'fs'
import path from 'path'
import { campaigns, Campaign } from './campaigns'

export type CampaignState = {
  disabledCampaigns: string[]
  topBannerCampaignId?: string | null
}

function getCampaignStatePath() {
  return path.join(process.cwd(), 'src', 'agent', 'campaignState.json')
}

export function loadCampaignState(): CampaignState {
  try {
    const raw = fs.readFileSync(getCampaignStatePath(), 'utf8')
    const parsed = JSON.parse(raw)
    return {
      disabledCampaigns: parsed.disabledCampaigns || [],
      topBannerCampaignId: parsed.topBannerCampaignId !== undefined ? parsed.topBannerCampaignId : null
    }
  } catch {
    return { disabledCampaigns: [], topBannerCampaignId: null }
  }
}

function writeCampaignState(state: CampaignState) {
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

export function getDisabledCampaigns(): Campaign[] {
  const state = loadCampaignState()
  return campaigns.filter(c => state.disabledCampaigns.includes(c.id))
}

export function setPersistedTopBanner(campaignId: string | null) {
  const state = loadCampaignState()
  state.topBannerCampaignId = campaignId
  writeCampaignState(state)
  
  for (const campaign of campaigns) {
    campaign.isTopBanner = campaign.id === campaignId
  }
}

// Re-apply persisted disabled and top banner state when this module is first loaded
const _initialState = loadCampaignState()
_initialState.disabledCampaigns.forEach(id => {
  const campaign = campaigns.find(c => c.id === id)
  if (campaign) campaign.enabled = false
})

const activeTopBannerId = _initialState.topBannerCampaignId
for (const campaign of campaigns) {
  campaign.isTopBanner = campaign.id === activeTopBannerId
}

