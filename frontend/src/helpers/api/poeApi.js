import axios from 'axios';

/**
 * Call backend endpoint which returns an object containing all the user's stash tab names and meta data (not the actual contents)
 * @param {{accountName: String, league: String, POESESSID: String}} options 
 */
export function getTabOverviewFromBackend(options){
    axios
        .post('/poe/tabs/overview', options)
        .then(res => res.data)
        .catch(err => err.status)
}