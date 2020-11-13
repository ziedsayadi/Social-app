
const isEmpty =(string) =>{
    (string.trim()==='') ? true : false}


exports.reduceDetails=(data)=>{
    let userDetails ={}
    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())) {
        if((data.website.trim()).substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`
        } else 
        userDetails.website = data.website
    }
    if(!isEmpty(data.profileImage.trim())) userDetails.profileImage = data.profileImage;
    if(!isEmpty(data.location.trim()))  userDetails.location = data.location;
    
    return userDetails
}