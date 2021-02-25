import { Router } from 'express';
import SurveyController from './controllers/SurveyController';
import UserController from './controllers/UserController';

const userController = new UserController();
const surveyController = new SurveyController();

const router = Router();

router.get("/surveys", surveyController.show);
router.post("/users", userController.create);
router.post("/surveys", surveyController.create);

export default router;