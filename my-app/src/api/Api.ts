/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Flight {
  /** ID */
  id?: number;
  /** Ships */
  ships?: string;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /** Launch cosmodrom */
  launch_cosmodrom?: string | null;
  /** Arrival cosmodrom */
  arrival_cosmodrom?: string | null;
  /**
   * Estimated launch date
   * @format date-time
   */
  estimated_launch_date?: string | null;
  /** Result */
  result?: boolean | null;
}
interface ApiResponse {
  status: string;
}

export interface Ship {
  /** ID */
  id?: number;
  /** Image */
  image?: string;
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /** Статус */
  status?: number;
  /** Описание */
  description?: string;
  /**
   * Creation date
   * @format date
   */
  creation_date?: string;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";
import { T_Ship } from "src/modules/types";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "method" | "query" | "path"> & {
  body?: FormData; // Добавляем body
};

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  flights = {
    /**
     * No description
     *
     * @tags flights
     * @name FlightsList
     * @request GET:/flights/
     * @secure
     */
    flightsList: (
      query?: {
        /** Фильтр по статусу отправки */
        status?: number;
        /**
         * Начальная дата формирования (формат: YYYY-MM-DDTHH:MM:SS)
         * @format date-time
         */
        date_formation_start?: string;
        /**
         * Конечная дата формирования (формат: YYYY-MM-DDTHH:MM:SS)
         * @format date-time
         */
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Flight[], void>({
        path: `/flights/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsRead
     * @request GET:/flights/{flight_id}/
     * @secure
     */
    flightsRead: (flightId: string, params: RequestParams = {}) =>
      this.request<Flight, void>({
        path: `/flights/${flightId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsDeleteDelete
     * @request DELETE:/flights/{flight_id}/delete/
     * @secure
     */
    flightsDeleteDelete: (flightId: string, params: RequestParams = {}) =>
      this.request<Flight, void>({
        path: `/flights/${flightId}/delete/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsDeleteShipDelete
     * @request DELETE:/flights/{flight_id}/delete_ship/{ship_id}/
     * @secure
     */
    flightsDeleteShipDelete: (
      flightId: string,
      shipId: string,
      params: RequestParams = {},
    ) =>
      this.request<object, void>({
        path: `/flights/${flightId}/delete_ship/${shipId}/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsUpdateUpdate
     * @request PUT:/flights/{flight_id}/update/
     * @secure
     */
    flightsUpdateUpdate: (
      flightId: string,
      data: {
        /** Космодром отправки: */
        launch_cosmodrom?: string;
        /** Космодром прилета: */
        arrival_cosmodrom?: string;
        /** Предполагаемая дата запуска: */
        estimated_launch_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Flight, void>({
        path: `/flights/${flightId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsUpdateShipUpdate
     * @request PUT:/flights/{flight_id}/update_ship/{ship_id}/
     * @secure
     */
    flightsUpdateShipUpdate: (
      flightId: string,
      shipId: string,

      data: {
        /** Новая полезная нагрузка */
        payload: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, void>({
        path: `/flights/${flightId}/update_ship/${shipId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsUpdateStatusAdminUpdate
     * @request PUT:/flights/{flight_id}/update_status_admin/
     * @secure
     */
    flightsUpdateStatusAdminUpdate: (
      flightId: string,

      data: {
        /** Новый статус отправки (3 для завершения, 4 для отклонения) */
        status: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Flight, void>({
        path: `/flights/${flightId}/update_status_admin/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags flights
     * @name FlightsUpdateStatusUserUpdate
     * @request PUT:/flights/{flight_id}/update_status_user/
     * @secure
     */
    flightsUpdateStatusUserUpdate: (flightId: string, params: RequestParams = {}) =>
      this.request<Flight, void>({
        path: `/flights/${flightId}/update_status_user/`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  ships = {
    /**
     * No description
     *
     * @tags ships
     * @name ShipsList
     * @request GET:/ships/
     * @secure
     */
    shipsList: (
      query?: {
        ship_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ships/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsCreateCreate
     * @request POST:/ships/create/
     * @secure
     */
    shipsCreateCreate: (data: Ship, params: RequestParams = {}) =>
      this.request<object, void>({
        path: `/ships/create/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsRead
     * @request GET:/ships/{ship_id}/
     * @secure
     */
    shipsRead: (shipId: string, params: RequestParams = {}) =>
      this.request<object, void>({
        path: `/ships/${shipId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsAddToFlightCreate
     * @request POST:/ships/{ship_id}/add_to_flight/
     * @secure
     */
    shipsAddToFlightCreate: (shipId: string,  params: RequestParams = {}) =>
      this.request<object[], void>({
        path: `/ships/${shipId}/add_to_flight/`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsDeleteDelete
     * @request DELETE:/ships/{ship_id}/delete/
     * @secure
     */
    shipsDeleteDelete: (shipId: string, params: RequestParams = {}) =>
      this.request<object[], void>({
        path: `/ships/${shipId}/delete/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsUpdateUpdate
     * @request PUT:/ships/{ship_id}/update/
     * @secure
     */
    shipsUpdateUpdate: (shipId: string, data: Ship, params: RequestParams = {}) =>
      this.request<object, void>({
        path: `/ships/${shipId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsUpdateImageCreate
     * @request POST:/ships/{ship_id}/update_image/
     * @secure
     */
    shipsUpdateImageCreate: (
      shipId: string,

      data: {
        /**
         * Новое изображение для космолета
         * @format binary
         */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, void>({
        path: `/ships/${shipId}/update_image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (
      data: {
        username: string;
        password: string;
      },
      params: RequestParams = {},
    ) => 
      this.request<ApiResponse, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.UrlEncoded,
        ...params,
      }),
    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: RegisterRequest, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
