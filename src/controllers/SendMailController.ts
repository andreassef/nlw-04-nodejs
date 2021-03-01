import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysRepository";
import SurveyUsersRepository from "../repositories/SurveysUsersRepository";
import UsersRepository from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import AppError from "../errors/AppError";


class SendMailController {

    async excute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const userAlreadExists = await usersRepository.findOne({email});

        if (!userAlreadExists) {
            throw new AppError("Users does not exists");
            //return response.status(400).json({error: "Users does not exists"});
        };

        const surveyAlreadExists = await surveyRepository.findOne({id: survey_id});

        if (!surveyAlreadExists) {
            throw new AppError("Survey does not exists!");
            // return response.status(400).json({
            //     error: "Survey does not exists!"
            // })
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveyUsersRepository.findOne({
            //where: [{user_id: userAlreadExists.id}, {value: null}] -> dessa forma, estavamos utilizando o operador OR, de modo que nossa consulta sempre iria retornar o primeiro usuário com ID e valor NULL que encontrasse
            where: {user_id: userAlreadExists.id, value: null}, // dessa forma, estamos fazendo a consulta com AND, onde o id do usuário é igual e valor null
            relations: ["user", "survey"]
        });

        const variables = {
            name: userAlreadExists.name,
            title: surveyAlreadExists.title,
            description: surveyAlreadExists.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, surveyAlreadExists.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        // Salvar informacoes na tabela
        const surveyUser = surveyUsersRepository.create({
            user_id: userAlreadExists.id,
            survey_id
        });

        await surveyUsersRepository.save(surveyUser);

        // Enviar e-mail para o usuário
        variables.id = surveyUserAlreadyExists.id;
        await SendMailService.execute(email, surveyAlreadExists.title, variables, npsPath);

        return response.status(201).json(surveyUser);
    }

}

export default SendMailController;