async function getErrorFromResponse(res) {
  const details = {
    status: res.status
  };

  if (/^application\/json/.test(res.headers.get("Content-Type"))) {
    details.responseBody = await res.json();
  }

  const err = new Error("Not ok response");

  err.details = details;

  return err;
}

export default class NetworkInterface {
  constructor() {
    // Fetch is exposed on our constructor to make it overridable in tests and
    // in development.
    this.fetch = window.fetch.bind(window);

    this.queue = [];
    this.isExecutingMutatingNetworkAction = false;

    this.authToken = null;
  }

  setAuthToken(token) {
    // This method will be called on login and on page load
    this.authToken = token;
  }

  processRequest() {
    if (this.queue.length === 0 || this.isExecutingMutatingNetworkAction) {
      return null;
    }

    const [method, url, options, promise] = this.queue.shift();

    if (method !== "GET") {
      this.isExecutingMutatingNetworkAction = true;
    }

    this.request(url, options).then(
      res => {
        if (method !== "GET") {
          this.isExecutingMutatingNetworkAction = false;
        }
        promise.resolve(res);
        this.processRequest();
      },
      err => {
        if (method !== "GET") {
          this.isExecutingMutatingNetworkAction = false;
        }
        promise.reject(err);
        this.processRequest();
      }
    );
  }

  enqueueRequest(url, options) {
    return new Promise((resolve, reject) => {
      this.queue.push([
        (options && options.method) || "GET",
        url,
        options,
        { resolve, reject }
      ]);
      this.processRequest();
    });
  }

  /**
   * @param {String} url
   * @param {RequestInit=} options
   */
  request(url, options) {
    const headers = { ...options?.headers };
    // This logic now uses the token set by setAuthToken
    if (this.authToken) {
      headers["Authorization"] = `Token ${this.authToken}`;
    }

    return this.fetch(url, {
      ...options,
      headers,
      credentials: "include"
    });
  }

  async get(url) {
    const res = await this.enqueueRequest(url);

    if (!res.ok) {
      const err = await getErrorFromResponse(res);
      throw err;
    }

    return res;
  }

  async post(url, body) {
    const options = {
      method: "POST"
    };

    if (body) {
      options.headers = {
        "Content-Type": "application/json"
      };

      options.body = JSON.stringify(body);
    }

    const res = await this.enqueueRequest(url, options);

    if (!res.ok) {
      const err = await getErrorFromResponse(res);
      throw err;
    }

    return res;
  }

  async patch(url, body) {
    const options = {
      method: "PATCH"
    };

    options.headers = {
      "Content-Type": "application/json"
    };

    options.body = JSON.stringify(body);

    const res = await this.enqueueRequest(url, options);

    if (!res.ok) {
      const err = await getErrorFromResponse(res);
      throw err;
    }

    return res;
  }

  async delete(url, body) {
    const options = {
      method: "DELETE"
    };

    if (body) {
      options.headers = {
        "Content-Type": "application/json"
      };

      options.body = JSON.stringify(body);
    }

    const res = await this.enqueueRequest(url, options);

    if (!res.ok) {
      const err = await getErrorFromResponse(res);
      throw err;
    }

    return res;
  }

  async put(url, body) {
    const options = {
      method: "PUT"
    };

    if (body) {
      options.headers = {
        "Content-Type": "application/json"
      };

      options.body = JSON.stringify(body);
    }

    const res = await this.enqueueRequest(url, options);

    if (!res.ok) {
      const err = await getErrorFromResponse(res);
      throw err;
    }

    return res;
  }
}
