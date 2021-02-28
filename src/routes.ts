import { Router } from 'express';
import SendMailController from './controllers/SendMailController';
import SurveyController from './controllers/SurveyController';
import UserController from './controllers/UserController';

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const router = Router();

router.get("/surveys", surveyController.show);
router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.post("/sendMail", sendMailController.excute);

export default router;