import { LoginBody, LoginResponse, RefreshTokenResponse } from "@/types/index";
import { axiosInstance } from "src/utils/axiosInstance";
import { invalidateUrl, loginUrl, refreshTokenUrl } from "../endpoints";

class AuthService {
  async login(body: LoginBody): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(loginUrl, body);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return Promise.reject(error);
    }
  }

  async invalidate(refreshToken: string): Promise<void> {
    await axiosInstance.post(invalidateUrl, {
      refreshToken,
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post<RefreshTokenResponse>(
      refreshTokenUrl,
      {
        refreshToken,
      }
    );
    return response.data;
  }
}

export const authService = new AuthService();
