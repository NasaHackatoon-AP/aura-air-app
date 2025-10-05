import api from '../lib/api';

interface createUser {
    nome: string;
    email: string;
    senha: string;
    data_nascimento: string;
    cidade: string;
    estado: string;
}

interface loginUser {
    email: string;
    senha: string;
}

interface userLoginResponse {

}

export const loginUser = async (user: loginUser) => {
    const response = await api.post('/airquality/login', user);
    return response.data;
}

export const createUser = async (user: createUser) => {
    const response = await api.post('/airquality/usuario', user);
    return response; // return full response so caller can check status
}