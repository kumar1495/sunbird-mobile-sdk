import {BaseConnection} from './base-connection';
import {ApiConfig, HttpClient, HttpRequestType, HttpSerializer, Request, Response, ResponseCode} from '..';
import {DeviceInfo} from '../../util/device';
import {SharedPreferences} from '../../util/shared-preferences';
import {ApiAuthenticator} from '../../util/authenticators/impl/api-authenticator';
import {SessionAuthenticator} from '../../util/authenticators/impl/session-authenticator';
import {of} from 'rxjs';
import {anything, instance, mock, when} from 'ts-mockito';

describe('BaseConnection', () => {
  let baseConnection: BaseConnection;
  const mockHttpClient = {
    setSerializer(httpSerializer: HttpSerializer) {
    },
    addHeaders(headers: { [p: string]: string }) {
    }
  } as Partial<HttpClient>;
  const mockApiConfig = {
    api_authentication: {
      channelId: 'SAMPLE_CHANNEL_ID'
    }
  } as Partial<ApiConfig>;
  const mockDeviceInfo = {
    getDeviceID(): string {
      return 'SAMPLE_DEVICE_ID';
    }
  } as Partial<DeviceInfo>;
  const mockSharedPreferences = {} as Partial<SharedPreferences>;
  const defaultApiAuthenticators: ApiAuthenticator[] = [];
  const defaultSessionAuthenticators: SessionAuthenticator[] = [];

  beforeAll(() => {
    baseConnection = new BaseConnection(
      mockHttpClient as HttpClient,
      mockApiConfig as ApiConfig,
      mockDeviceInfo as DeviceInfo,
      mockSharedPreferences as SharedPreferences,
      defaultApiAuthenticators,
      defaultSessionAuthenticators
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should invoke httpClient.get on invoke() with GET request', (done) => {
    // arrange
    mockHttpClient.get = jest.fn().mockImplementation((baseUrl: string, path: string, headers: any, parameters: any) => {
      const res = new Response();
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.body = {};
      return of(res);
    });

    const req = new Request.Builder()
      .withPath('/')
      .withType(HttpRequestType.GET)
      .build();

    // act
    baseConnection.invoke(req).subscribe(() => {
      // assert
      // TODO: remaining assertions
      expect(mockHttpClient.get).toHaveBeenCalled();
      done();
    });
  });

  it('should invoke httpClient.post on invoke() with POST request', (done) => {
    // arrange
    mockHttpClient.post = jest.fn().mockImplementation((baseUrl: string, path: string, headers: any, parameters: any) => {
      const res = new Response();
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.body = {};
      return of(res);
    });

    const req = new Request.Builder()
      .withPath('/')
      .withType(HttpRequestType.POST)
      .build();

    // act
    baseConnection.invoke(req).subscribe(() => {
      // assert
      // TODO: remaining assertions
      expect(mockHttpClient.post).toHaveBeenCalled();
      done();
    });
  });

  it('should invoke httpClient.patch on invoke() with PATCH request', (done) => {
    // arrange
    mockHttpClient.patch = jest.fn().mockImplementation((baseUrl: string, path: string, headers: any, parameters: any) => {
      const res = new Response();
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.body = {};
      return of(res);
    });

    const req = new Request.Builder()
      .withPath('/')
      .withType(HttpRequestType.PATCH)
      .build();

    // act
    baseConnection.invoke(req).subscribe(() => {
      // assert
      // TODO: remaining assertions
      expect(mockHttpClient.patch).toHaveBeenCalled();
      done();
    });
  });

  it('should append default defaultApiAuthenticators if request.withApiToken is set', (done) => {
    // arrange
    const MockApiAuthenticator = mock<ApiAuthenticator>();
    when(MockApiAuthenticator.interceptRequest(anything())).thenCall((req) => of(req));
    when(MockApiAuthenticator.interceptResponse(anything(), anything())).thenCall((req, res) => of(res));
    const mockApiAuthenticator = instance(MockApiAuthenticator);
    const defaultApiAuthenticators = [mockApiAuthenticator];

    baseConnection = new BaseConnection(
      mockHttpClient as HttpClient,
      mockApiConfig as ApiConfig,
      mockDeviceInfo as DeviceInfo,
      mockSharedPreferences as SharedPreferences,
      defaultApiAuthenticators,
      defaultSessionAuthenticators
    );

    mockHttpClient.patch = jest.fn().mockImplementation((baseUrl: string, path: string, headers: any, parameters: any) => {
      const res = new Response();
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.body = {};
      return of(res);
    });

    const req = new Request.Builder()
      .withPath('/')
      .withType(HttpRequestType.PATCH)
      .withApiToken(true)
      .build();

    // act
    baseConnection.invoke(req).subscribe(() => {
      // assert
      expect(mockHttpClient.patch).toHaveBeenCalled();

      expect(req.authenticators).toContain(mockApiAuthenticator);
      expect(req.requestInterceptors).toContain(mockApiAuthenticator);
      expect(req.responseInterceptors).toContain(mockApiAuthenticator);

      done();
    });
  });

  it('should append default defaultApiAuthenticators if request.withApiToken is set', (done) => {
    // arrange
    const MockSessionAuthenticator = mock<SessionAuthenticator>();
    when(MockSessionAuthenticator.interceptRequest(anything())).thenCall((req) => of(req));
    when(MockSessionAuthenticator.interceptResponse(anything(), anything())).thenCall((req, res) => of(res));
    const mockSessionAuthenticator = instance(MockSessionAuthenticator);
    const defaultSessionAuthenticators = [mockSessionAuthenticator];

    baseConnection = new BaseConnection(
      mockHttpClient as HttpClient,
      mockApiConfig as ApiConfig,
      mockDeviceInfo as DeviceInfo,
      mockSharedPreferences as SharedPreferences,
      defaultApiAuthenticators,
      defaultSessionAuthenticators
    );

    mockHttpClient.patch = jest.fn().mockImplementation((baseUrl: string, path: string, headers: any, parameters: any) => {
      const res = new Response();
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.body = {};
      return of(res);
    });

    const req = new Request.Builder()
      .withPath('/')
      .withType(HttpRequestType.PATCH)
      .withSessionToken(true)
      .build();

    // act
    baseConnection.invoke(req).subscribe(() => {
      // assert
      expect(mockHttpClient.patch).toHaveBeenCalled();
      expect(req.authenticators).toContain(mockSessionAuthenticator);
      expect(req.requestInterceptors).toContain(mockSessionAuthenticator);
      expect(req.responseInterceptors).toContain(mockSessionAuthenticator);
      done();
    });
  });

  it('should set appropriate serializer when request.withSerializer', (done) => {
    // arrange
    mockHttpClient.patch = jest.fn().mockImplementation((baseUrl: string, path: string, headers: any, parameters: any) => {
      const res = new Response();
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.responseCode = ResponseCode.HTTP_SUCCESS;
      res.body = {};
      return of(res);
    });
    mockHttpClient.setSerializer = jest.fn().mockImplementation((serializer) => serializer);

    const req = new Request.Builder()
      .withPath('/')
      .withType(HttpRequestType.PATCH)
      .withSerializer(HttpSerializer.URLENCODED)
      .withBody({})
      .build();

    // act
    baseConnection.invoke(req).subscribe(() => {
      // assert
      expect(mockHttpClient.patch).toHaveBeenCalled();
      expect(req.serializer).toEqual(HttpSerializer.URLENCODED);
      expect(mockHttpClient.setSerializer).toHaveBeenCalledWith(req.serializer);
      expect(typeof req.body).toEqual('string');
      done();
    });
  });
});
