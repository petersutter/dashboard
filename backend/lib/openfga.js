//
// SPDX-FileCopyrightText: 2024 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

const fetch = require('node-fetch-commonjs')

const logger = require('./logger')
const {
  fgaApiUrl,
  fgaStoreId,
  fgaApiToken
} = require('./config')

const url = `${fgaApiUrl}/stores/${fgaStoreId}/list-objects`

async function listProjects (user, role = 'viewer') {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${fgaApiToken}`
  }

  const body = JSON.stringify({
    user: `user:${user}`,
    relation: role,
    type: 'gardener_project'
  })

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  })

  if (!response.ok) {
    throw new Error(`Openfga request failed with status: ${response.status}`)
  }

  const { objects } = await response.json()
  logger.debug('Openfga response objects: %s', objects)
  return objects.map(name => name.substring('gardener_project:garden-'.length))
}

module.exports = {
  listProjects
}