
export const updateOrbisData = async (data, user, orbis) => {

    //Populate newData object with previous data
    let newData = {};
    newData = { ...user.details.profile }
    if (user.username) {
        newData.username = user.username;
    }

    //Add new data
    if (!newData.data) { //If data empty, set to empty object to prevent errors
        newData.data = {}
    }

    if (data.creatorDescription) {
        newData.data['creatorDescription'] = data.creatorDescription
    }

    if (data.lock) {
        newData.data['lock'] = {
            address: data.lock.address,
            chain: data.lock.chain
        }
    }

    if (data.nullifier_hash) {
        newData.data['nullifier_hash'] = data.nullifier_hash
    }

    if(data.username && data.username != '') {
        newData.username = data.username
    }

    if(data.description && data.description != '') {
        newData.description = data.description
    }

    if(data.pfp) {
        newData.pfp = data.pfp
    }

    if(data.cover) {
        newData.cover = data.cover
    }

    //Update
    console.log('Updating data', newData);
    const orbisRes = await orbis.updateProfile(newData);
    console.log('Updated Oribs data', orbisRes);

    return (true);
}