import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';
  const cookie = req.headers.cookie || '';

  try {
    const response = await axios({
      method: req.method,
      url: `https://sp-globalnomad-api.vercel.app/16-2/${path}`,
      headers: { Cookie: cookie },
      data: req.body,
      withCredentials: true,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    res
      .status(axiosError.response?.status || 500)
      .json(axiosError.response?.data || { error: 'unknown' });
  }
}
