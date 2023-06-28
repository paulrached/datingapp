// The routes file handles the mapping of URL routes to the corresponding controller methods
import express from 'express';

import { login, signUp,fetchInfo,getLanguage,getReligion,UploadFile,getInterests,getUserInfo,checkUsernameAvailability
    ,getRandUserInfo,saveLike, agetUsers, adeleteUser, agetInterests, acreateInterest, adeleteInterest, agetLanguage
    , acreateLanguage, adeleteLanguage, adeleteReligion, acreateReligion, agetReligion,deleteProfile
    ,getallUserInfo,getmatchUserInfo,saveNbchat, unMatch, undeleteUser, agetUsers1, payment, Block, unBlock, userBlockedinfo
    , editUserInfo, EditPicture} from './Controller.js';

const router = express.Router();
 
router.post('/editUserProfile', editUserInfo); 
router.post('/EditPicture', EditPicture); 
router.get('/userBlockedinfo', userBlockedinfo); 
router.post('/Block', Block); 
router.post('/unBlock', unBlock); 
router.post('/Login', login); 
router.post('/unMatch', unMatch);
router.post('/SignUp', signUp);
router.get('/Language', getLanguage);
router.post('/CreateProfile',fetchInfo);
router.get('/Religion', getReligion);
router.post('/UploadFile',UploadFile);
router.post('/saveLike',saveLike);
router.post('/saveNbchat',saveNbchat)
router.get('/interests', getInterests);
router.get('/userInfo',getUserInfo)
router.get('/alluserInfo',getallUserInfo)
router.get('/usermatchInfo',getmatchUserInfo)
router.get('/RanduserInfo',getRandUserInfo)
router.get('/checkUsername',checkUsernameAvailability);
router.post('/deleteProfile',deleteProfile);
router.post('/UserPayment', payment);

///admin
router.post('/undeleteUser/:name', undeleteUser);
router.get('/ausers', agetUsers);
router.get('/ausers1', agetUsers1);
router.delete('/ausers/:name', adeleteUser);
router.get('/ainterests', agetInterests);
router.post('/ainterests', acreateInterest);
router.delete('/ainterests/:name', adeleteInterest);
router.get('/aLanguage', agetLanguage);
router.post('/aLanguage', acreateLanguage);
router.delete('/aLanguage/:name', adeleteLanguage);
router.get('/aReligion', agetReligion);
router.post('/aReligion', acreateReligion);
router.delete('/aReligion/:name', adeleteReligion);
/////admin////

// Password reset request endpoint
// router.post('/reset-request', resetPasswordController.handlePasswordResetRequest);

// // Password reset endpoint
// router.post('/reset-password', resetPasswordController.handlePasswordReset);
export default router;