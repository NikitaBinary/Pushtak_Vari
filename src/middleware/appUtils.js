const axios = require('axios');
let appUtils = {
    /**
     * @description Split array to chunks
     * @param data
     * @author
     */
    splitArrayInToChunks: (data) => {
        //console.log(data,"'--()",...data)
        return [].concat(
            ...data.map(function(elem, i) {
                return i % 100 ? [] : [data.slice(i, i + 100)];
            })
        );
    },
    /**
     *
     * @param payload @description Fornmat push data for payload
     * @param token
     * @author
     */
    formatDataForPush: (payload, token) => {
        return {
            registration_ids: token,
            notification: {
                title: payload['title'],
                body: payload['body'],
                sound: 'default',
                type: payload['type'],
                imageUrl: "http://ebook.prometteur.in:5050/uploads/1713415943658-Bracket.png",
                force: true,
                badge: 1,
            },
            data: payload['data'],
            priority: 'high',
        };
    },
 
    /**
     * @function thirdPartyAPI
     * @description Third Partyies API's Hits (Now its using for hitting the bank approve from admin panel to approve bank resurst to cashfree)
     * @param { } payload
     * @author
     */
    thirdPartyAPI: (URL, payload) => {
        axios.default.post(`${URL}`, payload, {
            headers: {
                'content-type': 'application/json',
            },
        }).then(function(response) {
            resolve(response);
        }).catch(function(error) {
            console.log('AXIOS Third Party API ERROR ', error);
            // reject(error);
            resolve({ data: '' });
        });
    }
 
};
module.exports = appUtils;
 