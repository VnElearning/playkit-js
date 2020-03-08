// @flow
import type {FairplayDrmConfigType} from '../engines/html5/media-source/adapters/fairplay-drm-handler';
import Env from '../../src/utils/env';
import getLogger from '../utils/logger';
import {DrmScheme} from './drm-scheme';

let _logger = getLogger('FairPlay');

let FairPlay: IDrmProtocol = class FairPlay {
  /**
   * FairPlay is the configure key system.
   * @param {Array<Object>} drmData - The drm data.
   * @param {PKDrmConfigObject} drmConfig - The drm config.
   * @return {boolean} - Whether FairPlay is the configure key system.
   */
  static isConfigured(drmData: Array<Object>, drmConfig: PKDrmConfigObject): boolean {
    return DrmScheme.FAIRPLAY === drmConfig.keySystem && !!drmData.find(drmEntry => drmEntry.scheme === drmConfig.keySystem);
  }

  /**
   * FairPlay playback supports in case 2 conditions are met:
   * 1. The environment supports FairPlay playback.
   * 2. The drm data of the source object contains entry with FairPlay scheme.
   * @param {Array<Object>} drmData - The drm data to check.
   * @return {boolean} - Whether FairPlay can be play on the current environment.
   */
  static canPlayDrm(drmData: Array<Object>): boolean {
    _logger.debug('Can play DRM scheme of: ' + DrmScheme.FAIRPLAY);
    const isSafari = Env.browser.name && Env.browser.name.includes('Safari');
    return !!drmData.find(drmEntry => drmEntry.scheme === DrmScheme.FAIRPLAY) && isSafari;
  }
  /**
   * Sets the FairPlay playback.
   * @param {FairplayDrmConfigType} config - The config to manipulate.
   * @param {Array<Object>} drmData - The drm data.
   * @returns {void}
   */
  static setDrmPlayback(config: FairplayDrmConfigType, drmData: Array<Object>): void {
    _logger.debug('Sets drm playback');
    let drmEntry = drmData.find(drmEntry => drmEntry.scheme === DrmScheme.FAIRPLAY);
    if (drmEntry) {
      config.licenseUrl = drmEntry.licenseUrl;
      config.certificate = drmEntry.certificate;
    }
  }
};

export default FairPlay;
