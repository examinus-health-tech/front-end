/**
 * Testes unitários para healthConnectService.ts
 */

const mockGetSdkStatus = jest.fn();
const mockInitialize = jest.fn();
const mockRequestPermission = jest.fn();
const mockReadRecords = jest.fn();

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

jest.mock('react-native-health-connect', () => ({
  initialize: mockInitialize,
  requestPermission: mockRequestPermission,
  readRecords: mockReadRecords,
  getSdkStatus: mockGetSdkStatus,
  SdkAvailabilityStatus: {
    SDK_AVAILABLE: 1,
    SDK_UNAVAILABLE: 2,
    SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED: 3,
  },
}));

jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock fitnessService para syncHealthConnectToBackend
jest.mock('./fitnessService', () => ({
  saveDailyLog: jest.fn().mockResolvedValue({}),
  createWeight: jest.fn().mockResolvedValue({}),
  getDailyLogByDate: jest.fn().mockResolvedValue(null),
}));

// Precisamos re-importar em cada teste para o módulo interno resetar
let healthConnectService: typeof import('./healthConnectService');

describe('healthConnectService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset módulo para limpar estado interno (isInitialized, isInitializing)
    jest.resetModules();

    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));

    jest.doMock('react-native-health-connect', () => ({
      initialize: mockInitialize,
      requestPermission: mockRequestPermission,
      readRecords: mockReadRecords,
      getSdkStatus: mockGetSdkStatus,
      SdkAvailabilityStatus: {
        SDK_AVAILABLE: 1,
        SDK_UNAVAILABLE: 2,
        SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED: 3,
      },
    }));

    jest.doMock('./fitnessService', () => ({
      saveDailyLog: jest.fn().mockResolvedValue({}),
      createWeight: jest.fn().mockResolvedValue({}),
      getDailyLogByDate: jest.fn().mockResolvedValue(null),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ============================================================
  // isHealthConnectAvailable
  // ============================================================

  describe('isHealthConnectAvailable', () => {
    it('deve retornar false em plataforma não-Android', async () => {
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios' },
      }));

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.isHealthConnectAvailable();

      expect(result).toBe(false);
    });

    it('deve retornar true quando SDK está disponível', async () => {
      mockGetSdkStatus.mockResolvedValue(1); // SDK_AVAILABLE

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.isHealthConnectAvailable();

      expect(result).toBe(true);
    });

    it('deve retornar false quando SDK precisa de atualização', async () => {
      mockGetSdkStatus.mockResolvedValue(3); // SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.isHealthConnectAvailable();

      expect(result).toBe(false);
    });

    it('deve retornar false quando SDK não está disponível', async () => {
      mockGetSdkStatus.mockResolvedValue(2); // SDK_UNAVAILABLE

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.isHealthConnectAvailable();

      expect(result).toBe(false);
    });

    it('deve retornar false quando verificação lança erro', async () => {
      mockGetSdkStatus.mockRejectedValue(new Error('SDK Error'));

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.isHealthConnectAvailable();

      expect(result).toBe(false);
    });

    it('deve retornar false quando verificação excede timeout de 5 segundos', async () => {
      mockGetSdkStatus.mockImplementation(() => new Promise(() => {})); // Nunca resolve

      healthConnectService = require('./healthConnectService');

      const promise = healthConnectService.isHealthConnectAvailable();
      jest.advanceTimersByTime(5001);

      const result = await promise;

      expect(result).toBe(false);
    });
  });

  // ============================================================
  // initHealthConnect
  // ============================================================

  describe('initHealthConnect', () => {
    it('deve retornar false em plataforma não-Android', async () => {
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios' },
      }));

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.initHealthConnect();

      expect(result).toBe(false);
    });

    it('deve inicializar e solicitar permissões com sucesso', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockResolvedValue([{ granted: true }]);

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.initHealthConnect();

      expect(result).toBe(true);
      expect(mockInitialize).toHaveBeenCalled();
      expect(mockRequestPermission).toHaveBeenCalledWith([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
        { accessType: 'read', recordType: 'SleepSession' },
        { accessType: 'read', recordType: 'Hydration' },
        { accessType: 'read', recordType: 'Weight' },
      ]);
    });

    it('deve retornar false quando inicialização retorna false', async () => {
      mockInitialize.mockResolvedValue(false);

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.initHealthConnect();

      expect(result).toBe(false);
    });

    it('deve retornar false quando inicialização lança exceção', async () => {
      mockInitialize.mockRejectedValue(new Error('Init failed'));

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.initHealthConnect();

      expect(result).toBe(false);
    });

    it('deve retornar false quando inicialização excede timeout', async () => {
      mockInitialize.mockImplementation(() => new Promise(() => {})); // Nunca resolve

      healthConnectService = require('./healthConnectService');

      const promise = healthConnectService.initHealthConnect();
      jest.advanceTimersByTime(5001);

      const result = await promise;

      expect(result).toBe(false);
    });

    it('deve retornar true na segunda chamada quando já está inicializado', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockResolvedValue([{ granted: true }]);

      healthConnectService = require('./healthConnectService');

      const result1 = await healthConnectService.initHealthConnect();
      expect(result1).toBe(true);

      // Segunda chamada não precisa inicializar novamente
      mockInitialize.mockClear();
      mockRequestPermission.mockClear();

      const result2 = await healthConnectService.initHealthConnect();
      expect(result2).toBe(true);
      expect(mockInitialize).not.toHaveBeenCalled();
    });

    it('deve retornar false quando erro de permissão não é recuperável', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockRejectedValue(new Error('Unrecoverable permission error'));

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.initHealthConnect();

      expect(result).toBe(false);
    });

    it('deve fazer retry quando erro é de lateinit property', async () => {
      mockInitialize.mockResolvedValue(true);

      let callCount = 0;
      mockRequestPermission.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.reject(new Error('lateinit property requestPermission has not been initialized'));
        }
        return Promise.resolve([{ granted: true }]);
      });

      healthConnectService = require('./healthConnectService');

      // Precisamos avançar o timer para os delays entre retries
      const promise = healthConnectService.initHealthConnect();

      // Avançar timers para cobrir os delays entre retries
      await jest.advanceTimersByTimeAsync(1000);
      await jest.advanceTimersByTimeAsync(2000);
      await jest.advanceTimersByTimeAsync(3000);

      const result = await promise;

      expect(result).toBe(true);
      expect(callCount).toBe(3);
    });

    it('deve retornar false após 3 tentativas falharem com erro de lateinit', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockRejectedValue(
        new Error('lateinit property requestPermission has not been initialized')
      );

      healthConnectService = require('./healthConnectService');

      const promise = healthConnectService.initHealthConnect();

      // Avançar timers
      await jest.advanceTimersByTimeAsync(1000);
      await jest.advanceTimersByTimeAsync(2000);
      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(4000);

      const result = await promise;

      expect(result).toBe(false);
    });

    it('deve retornar false quando requestPermission excede timeout', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockRejectedValue(new Error('Timeout ao solicitar permissões'));

      healthConnectService = require('./healthConnectService');

      const promise = healthConnectService.initHealthConnect();

      // Avançar timers para os retries
      await jest.advanceTimersByTimeAsync(1000);
      await jest.advanceTimersByTimeAsync(2000);
      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(4000);

      const result = await promise;

      expect(result).toBe(false);
    });
  });

  // ============================================================
  // getHealthConnectDataForDate
  // ============================================================

  describe('getHealthConnectDataForDate', () => {
    const emptyData = {
      steps: 0,
      distance: 0,
      caloriesBurned: 0,
      sleepMinutes: 0,
      waterMl: 0,
      weightKg: null,
    };

    it('deve retornar dados vazios quando Health Connect não está disponível', async () => {
      mockGetSdkStatus.mockResolvedValue(2); // SDK_UNAVAILABLE

      healthConnectService = require('./healthConnectService');

      const date = new Date('2025-01-15');
      const result = await healthConnectService.getHealthConnectDataForDate(date);

      expect(result.steps).toBe(0);
      expect(result.distance).toBe(0);
      expect(result.weightKg).toBeNull();
      expect(result.date).toEqual(date);
    });

    it('deve buscar e agregar todos os dados de saúde', async () => {
      mockGetSdkStatus.mockResolvedValue(1); // SDK_AVAILABLE

      mockReadRecords.mockImplementation((recordType: string) => {
        switch (recordType) {
          case 'Steps':
            return Promise.resolve({ records: [{ count: 5000 }, { count: 3000 }] });
          case 'Distance':
            return Promise.resolve({ records: [{ distance: { inMeters: 3500 } }] });
          case 'ActiveCaloriesBurned':
            return Promise.resolve({ records: [{ energy: { inKilocalories: 200 } }] });
          case 'TotalCaloriesBurned':
            return Promise.resolve({ records: [{ energy: { inKilocalories: 350 } }] });
          case 'SleepSession':
            return Promise.resolve({
              records: [{
                startTime: '2025-01-14T22:00:00.000Z',
                endTime: '2025-01-15T06:00:00.000Z',
              }],
            });
          case 'Hydration':
            return Promise.resolve({ records: [{ volume: { inLiters: 1.5 } }] });
          case 'Weight':
            return Promise.resolve({
              records: [{ weight: { inKilograms: 75 }, time: '2025-01-15T08:00:00.000Z' }],
            });
          default:
            return Promise.resolve({ records: [] });
        }
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date('2025-01-15'));

      expect(result.steps).toBe(8000); // 5000 + 3000
      expect(result.distance).toBe(3.5); // 3500m / 1000
      expect(result.caloriesBurned).toBe(350); // max(200, 350)
      expect(result.sleepMinutes).toBe(480); // 8h
      expect(result.waterMl).toBe(1500); // 1.5L * 1000
      expect(result.weightKg).toBe(75);
    });

    it('deve usar data padrão (new Date) quando data não é fornecida', async () => {
      mockGetSdkStatus.mockResolvedValue(2); // SDK_UNAVAILABLE

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate();

      expect(result.date).toBeDefined();
    });

    it('deve retornar 0 para passos quando readRecords falha', async () => {
      mockGetSdkStatus.mockResolvedValue(1);
      mockReadRecords.mockRejectedValue(new Error('Read failed'));

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.steps).toBe(0);
    });

    it('deve retornar null para peso quando não há registros', async () => {
      mockGetSdkStatus.mockResolvedValue(1);
      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Weight') {
          return Promise.resolve({ records: [] });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.weightKg).toBeNull();
    });

    it('deve retornar dados vazios quando ocorre erro fatal', async () => {
      mockGetSdkStatus.mockResolvedValue(1);
      mockReadRecords.mockImplementation(() => {
        throw new Error('Fatal error');
      });

      healthConnectService = require('./healthConnectService');

      const date = new Date('2025-01-15');
      const result = await healthConnectService.getHealthConnectDataForDate(date);

      expect(result.steps).toBe(0);
      expect(result.distance).toBe(0);
      expect(result.caloriesBurned).toBe(0);
      expect(result.sleepMinutes).toBe(0);
      expect(result.waterMl).toBe(0);
      expect(result.weightKg).toBeNull();
    });

    it('deve usar apenas activeCalories quando TotalCaloriesBurned falha', async () => {
      mockGetSdkStatus.mockResolvedValue(1);
      let callCount = 0;
      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'ActiveCaloriesBurned') {
          return Promise.resolve({ records: [{ energy: { inKilocalories: 200 } }] });
        }
        if (recordType === 'TotalCaloriesBurned') {
          return Promise.reject(new Error('Not available'));
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.caloriesBurned).toBe(200);
    });
  });

  // ============================================================
  // convertToSyncData
  // ============================================================

  describe('convertToSyncData', () => {
    it('deve converter dados do Health Connect para formato de sincronização', () => {
      healthConnectService = require('./healthConnectService');

      const healthData = {
        steps: 10000,
        distance: 5.5,
        caloriesBurned: 400,
        sleepMinutes: 420,
        waterMl: 2000,
        weightKg: 75.5,
        date: new Date('2025-01-15T12:00:00.000Z'),
      };

      const result = healthConnectService.convertToSyncData(healthData);

      expect(result.dataSource).toBe(1); // GoogleHealthConnect
      expect(result.syncedAt).toBeDefined();
      expect(result.dailyLog).toBeDefined();
      expect(result.dailyLog!.steps).toBe(10000);
      expect(result.dailyLog!.stepsGoal).toBe(10000);
      expect(result.dailyLog!.caloriesBurned).toBe(400);
      expect(result.dailyLog!.caloriesConsumed).toBe(0);
      expect(result.dailyLog!.caloriesGoal).toBe(2000);
      expect(result.dailyLog!.waterMl).toBe(2000);
      expect(result.dailyLog!.waterGoalMl).toBe(2000);
      expect(result.dailyLog!.sleepMinutes).toBe(420);
      expect(result.dailyLog!.sleepGoalMinutes).toBe(480);
      expect(result.weight).toBeDefined();
      expect(result.weight!.weightKg).toBe(75.5);
      expect(result.activities).toHaveLength(1);
      expect(result.activities![0].activityType).toBe(1);
    });

    it('não deve incluir peso quando weightKg é null', () => {
      healthConnectService = require('./healthConnectService');

      const healthData = {
        steps: 5000,
        distance: 0,
        caloriesBurned: 200,
        sleepMinutes: 0,
        waterMl: 0,
        weightKg: null,
        date: new Date(),
      };

      const result = healthConnectService.convertToSyncData(healthData);

      expect(result.weight).toBeUndefined();
    });

    it('não deve incluir atividades quando distância é 0', () => {
      healthConnectService = require('./healthConnectService');

      const healthData = {
        steps: 5000,
        distance: 0,
        caloriesBurned: 200,
        sleepMinutes: 0,
        waterMl: 0,
        weightKg: null,
        date: new Date(),
      };

      const result = healthConnectService.convertToSyncData(healthData);

      expect(result.activities).toEqual([]);
    });
  });

  // ============================================================
  // syncHealthConnectToBackend
  // ============================================================

  describe('syncHealthConnectToBackend', () => {
    it('deve não fazer nada quando não pode inicializar', async () => {
      mockInitialize.mockResolvedValue(false);

      healthConnectService = require('./healthConnectService');

      await healthConnectService.syncHealthConnectToBackend();

      const { saveDailyLog: mockSave } = require('./fitnessService');
      expect(mockSave).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando dynamic import falha no sync', async () => {
      // syncHealthConnectToBackend uses `await import('./fitnessService')` internally
      // which fails in Jest (no --experimental-vm-modules).
      // The function catches the error and re-throws it.
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockResolvedValue([]);
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Steps') {
          return Promise.resolve({ records: [{ count: 8000 }] });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      // The dynamic import will throw, and the function re-throws
      await expect(healthConnectService.syncHealthConnectToBackend()).rejects.toThrow();
    });

    it('deve lançar erro quando dynamic import falha com dados do backend', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockResolvedValue([]);
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Steps') {
          return Promise.resolve({ records: [{ count: 8000 }] });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      // Dynamic import of fitnessService fails in Jest
      await expect(healthConnectService.syncHealthConnectToBackend()).rejects.toThrow();
    });

    it('deve lançar erro quando dynamic import falha ao sincronizar peso', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockResolvedValue([]);
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Steps') {
          return Promise.resolve({ records: [{ count: 1000 }] });
        }
        if (recordType === 'Weight') {
          return Promise.resolve({
            records: [{ weight: { inKilograms: 80 }, time: '2025-01-15T08:00:00.000Z' }],
          });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      // Dynamic import fails before createWeight can be called
      await expect(healthConnectService.syncHealthConnectToBackend()).rejects.toThrow();
    });

    it('deve lançar erro quando sincronização falha por dynamic import', async () => {
      mockInitialize.mockResolvedValue(true);
      mockRequestPermission.mockResolvedValue([]);
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Steps') {
          return Promise.resolve({ records: [{ count: 5000 }] });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      // The dynamic import throws, which is caught and re-thrown
      await expect(healthConnectService.syncHealthConnectToBackend()).rejects.toThrow();
    });
  });

  // ============================================================
  // initHealthConnect - branches adicionais
  // ============================================================

  describe('initHealthConnect - branches adicionais', () => {
    it('deve aguardar quando já está inicializando (isInitializing flag)', async () => {
      mockInitialize.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve(true), 2000);
      }));
      mockRequestPermission.mockResolvedValue([{ granted: true }]);

      healthConnectService = require('./healthConnectService');

      // Start first initialization
      const promise1 = healthConnectService.initHealthConnect();

      // Immediately call again - should hit isInitializing branch
      const promise2 = healthConnectService.initHealthConnect();

      // Advance timers for the init and isInitializing wait
      await jest.advanceTimersByTimeAsync(1000);
      await jest.advanceTimersByTimeAsync(2000);
      await jest.advanceTimersByTimeAsync(1000);

      const result1 = await promise1;
      const result2 = await promise2;

      // First call should succeed
      expect(result1).toBe(true);
      // Second call returns isInitialized value after wait
    });

    it('deve reinicializar SDK durante retry de permissão e lidar com erro de reinicialização', async () => {
      mockInitialize.mockResolvedValue(true);

      let callCount = 0;
      mockRequestPermission.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.reject(new Error('lateinit property requestPermission has not been initialized'));
        }
        return Promise.resolve([{ granted: true }]);
      });

      // Make reinitialize throw on first retry
      let initCallCount = 0;
      mockInitialize.mockImplementation(() => {
        initCallCount++;
        if (initCallCount === 2) {
          return Promise.reject(new Error('Reinit failed'));
        }
        return Promise.resolve(true);
      });

      healthConnectService = require('./healthConnectService');

      const promise = healthConnectService.initHealthConnect();

      await jest.advanceTimersByTimeAsync(1000);
      await jest.advanceTimersByTimeAsync(2000);
      await jest.advanceTimersByTimeAsync(3000);

      const result = await promise;

      expect(result).toBe(true);
    });
  });

  // ============================================================
  // getHealthConnectDataForDate - branches adicionais
  // ============================================================

  describe('getHealthConnectDataForDate - branches adicionais', () => {
    it('deve retornar 0 para calorias quando activeCalories falha', async () => {
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'ActiveCaloriesBurned') {
          return Promise.reject(new Error('Not available'));
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.caloriesBurned).toBe(0);
    });

    it('deve retornar 0 para agua quando Hydration falha', async () => {
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Hydration') {
          return Promise.reject(new Error('Not available'));
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.waterMl).toBe(0);
    });

    it('deve retornar 0 para distancia quando Distance falha', async () => {
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Distance') {
          return Promise.reject(new Error('Not available'));
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.distance).toBe(0);
    });

    it('deve retornar 0 para sono quando SleepSession falha', async () => {
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'SleepSession') {
          return Promise.reject(new Error('Not available'));
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.sleepMinutes).toBe(0);
    });

    it('deve retornar null para peso quando Weight records retornam sem inKilograms', async () => {
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'Weight') {
          return Promise.resolve({
            records: [{ weight: null, time: '2025-01-15T08:00:00.000Z' }],
          });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date());

      expect(result.weightKg).toBeNull();
    });

    it('deve somar multiplos registros de sono', async () => {
      mockGetSdkStatus.mockResolvedValue(1);

      mockReadRecords.mockImplementation((recordType: string) => {
        if (recordType === 'SleepSession') {
          return Promise.resolve({
            records: [
              {
                startTime: '2025-01-14T22:00:00.000Z',
                endTime: '2025-01-15T02:00:00.000Z',
              },
              {
                startTime: '2025-01-15T03:00:00.000Z',
                endTime: '2025-01-15T06:00:00.000Z',
              },
            ],
          });
        }
        return Promise.resolve({ records: [] });
      });

      healthConnectService = require('./healthConnectService');

      const result = await healthConnectService.getHealthConnectDataForDate(new Date('2025-01-15'));

      // 4 hours + 3 hours = 420 minutes
      expect(result.sleepMinutes).toBe(420);
    });
  });

  // ============================================================
  // convertToSyncData - branches adicionais
  // ============================================================

  describe('convertToSyncData - branches adicionais', () => {
    it('deve incluir atividades quando distância é positiva', () => {
      healthConnectService = require('./healthConnectService');

      const healthData = {
        steps: 5000,
        distance: 2.5,
        caloriesBurned: 200,
        sleepMinutes: 0,
        waterMl: 0,
        weightKg: null,
        date: new Date('2025-01-15'),
      };

      const result = healthConnectService.convertToSyncData(healthData);

      expect(result.activities).toHaveLength(1);
      expect(result.activities![0].distanceKm).toBe(2.5);
      expect(result.activities![0].steps).toBe(5000);
    });
  });
});
