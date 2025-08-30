import NetworkInterface from "./NetworkInterface";

export default class Api {
  /**
   * @param {{ networkInterface: NetworkInterface }} options
   */
  constructor({ networkInterface } = {}) {
    if (!(networkInterface instanceof NetworkInterface)) {
      throw new Error("The Api class must be provided a NetworkInterface");
    }

    this.networkInterface = networkInterface;
  }

  async userSignup(payload) {
    const res = await this.networkInterface.post(
      `/api/auth/register/`,
      payload
    );

    return await res.json();
  }

  async socialLogin() {
    const res = await this.networkInterface.post(`/api/auth/linkedin/login/`);

    return await res.json();
  }

  async userLogin(payload) {
    const { email, password } = payload;
    const res = await this.networkInterface.post(`/api/auth/login/`, {
      email,
      password
    });

    return await res.json();
  }

  async requestPasswordReset(payload) {
    const res = await this.networkInterface.post(
      `/api/auth/password/reset/`,
      payload
    );
    return await res.json();
  }

  async confirmPasswordReset(payload) {
    // payload: { new_password1, new_password2, uid, token }
    const res = await this.networkInterface.post(
      `/api/auth/password/reset/confirm/`,
      payload
    );
    return await res.json();
  }
}
