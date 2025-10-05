import api from '../lib/api';

interface createUser {
    nome: string;
    email: string;
    senha: string;
    data_nascimento: string;
    cidade: string;
    estado: string;
}



export const createUser = async (user: createUser) => {
    const response = await api.post('/airquality/usuario', user);
    return response; // return full response so caller can check status
}

interface loginUser {
    email: string;
    senha: string;
}

export const loginUser = async (credentials: loginUser) => {
    const response = await api.post('/airquality/login', credentials);
    return response; // caller can read response.data.access_token and response.data.usuario
}