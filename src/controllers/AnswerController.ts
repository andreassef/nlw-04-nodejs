import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";
import SurveyUsersRepository from "../repositories/SurveysUsersRepository";

class AnswerController {

    async execute (request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUser = await surveyUsersRepository.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            throw new AppError("Survey users does not exists!");
            // return response.status(400).json({
            //     error: "Survey users does not exists!"
            // })
        }

        surveyUser.value = Number(value);

        await surveyUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export default AnswerController;