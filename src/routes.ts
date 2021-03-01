import { Router } from 'express';
import AnswerController from './controllers/AnswerController';
import NpsController from './controllers/NpsController';
import SendMailController from './controllers/SendMailController';
import SurveyController from './controllers/SurveyController';
import UserController from './controllers/UserController';

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

const router = Router();

router.get("/surveys", surveyController.show);
router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.post("/sendMail", sendMailController.excute);

export default router;