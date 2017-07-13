import union from 'lodash/union'
import { retrieveSettings } from '../util/storage/settings'
import { fetchExchangeRates } from '../util/currency'
import { sync } from '../util/storage/pouchdb'

export const LOAD_SETTINGS_REQUEST = 'LOAD_SETTINGS_REQUEST'
export const LOAD_SETTINGS_SUCCESS = 'LOAD_SETTINGS_SUCCESS'
export const LOAD_SETTINGS_FAILURE = 'LOAD_SETTINGS_FAILURE'
export function loadSettings() {
  return async dispatch => {
    dispatch({ type: LOAD_SETTINGS_REQUEST })
    try {
      const settings = await retrieveSettings()
      dispatch({ type: LOAD_SETTINGS_SUCCESS, settings })
      if (settings.sync) {
        dispatch(startSync(settings.sync))
      }
    } catch (error) {
      dispatch({ type: LOAD_SETTINGS_FAILURE, error })
    }
  }
}

export const UPDATE_EXCHANGE_RATE_REQUEST = 'UPDATE_EXCHANGE_RATE_REQUEST'
export const UPDATE_EXCHANGE_RATE_SUCCESS = 'UPDATE_EXCHANGE_RATE_SUCCESS'
export const UPDATE_EXCHANGE_RATE_FAILURE = 'UPDATE_EXCHANGE_RATE_FAILURE'
export function updateExchangeRate(base, secondary, used) {
  return async dispatch => {
    const target = union([base], secondary, used)
    dispatch({ type: UPDATE_EXCHANGE_RATE_REQUEST, base, target })
    try {
      const exchangeRate = await fetchExchangeRates(base, target)
      dispatch({
        type: UPDATE_EXCHANGE_RATE_SUCCESS,
        exchangeRate
      })
    } catch (error) {
      dispatch({ type: UPDATE_EXCHANGE_RATE_FAILURE, error })
    }
  }
}

export const COMPLETE_SETUP = 'COMPLETE_SETUP'
export function completeSetup() {
  return {
    type: COMPLETE_SETUP
  }
}

export const CHANGE_CURRENCY = 'CHANGE_CURRENCY'
export function changeCurrency(nextBase, secondary, currentBase) {
  const nextSecondary = secondary.includes(nextBase)
    ? secondary.concat(currentBase).filter(code => code !== nextBase)
    : secondary
  return {
    type: CHANGE_CURRENCY,
    base: nextBase,
    secondary: nextSecondary
  }
}

export const TOGGLE_SECTION_COLLAPSE = 'TOGGLE_SECTION_COLLAPSE'
export function toggleSectionCollapse(section) {
  return {
    type: TOGGLE_SECTION_COLLAPSE,
    section
  }
}

export const UPDATE_SYNC_SETTINGS = 'UPDATE_SYNC_SETTINGS'
export function updateSyncSettings(settings) {
  return async dispatch => {
    dispatch({ type: UPDATE_SYNC_SETTINGS, settings })
    dispatch(startSync(settings))
  }
}

export const START_SYNC = 'START_SYNC'
export function startSync(settings) {
  if (!settings.databases || !settings.host) return

  Object.keys(settings.databases).forEach(database =>
    sync(
      database,
      `${settings.host}${settings.databases[database]}`,
      settings.key,
      settings.password
    )
  )

  return { type: START_SYNC }
}
