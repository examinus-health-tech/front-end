/**
 * Testes unitários para campaignService.ts
 */

jest.mock('axios');

import axios from 'axios';
import { checkCampaignVoucher, CampaignVoucherResponse } from './campaignService';

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Reseta o cache do módulo entre testes para limpar a variável cachedVoucher
let campaignService: typeof import('./campaignService');

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  campaignService = require('./campaignService');
});

const CAMPAIGN_API_URL = 'https://campanhaapp-c7gdd2fyarecb5ck.canadacentral-01.azurewebsites.net/api/Campanha';

describe('campaignService', () => {
  // --------------------------------------------------------
  // checkCampaignVoucher
  // --------------------------------------------------------
  describe('checkCampaignVoucher', () => {
    it('deve retornar voucher quando API retorna código no campo "codigo"', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: {
          codigo: 'VOUCHER123',
          message: 'Voucher encontrado',
          validade: '2025-12-31',
          status: 'active',
        },
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');

      expect(result.success).toBe(true);
      expect(result.voucher).toBe('VOUCHER123');
      expect(result.validade).toBe('2025-12-31');
      expect(result.status).toBe('active');
    });

    it('deve retornar voucher quando API retorna código no campo "voucher"', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: {
          voucher: 'ABC-DEF',
        },
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(true);
      expect(result.voucher).toBe('ABC-DEF');
    });

    it('deve retornar voucher quando API retorna código no campo "code"', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: {
          code: 'CODE999',
        },
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(true);
      expect(result.voucher).toBe('CODE999');
    });

    it('deve retornar voucher quando API retorna string diretamente', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: 'PLAIN-VOUCHER-XYZ',
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(true);
      expect(result.voucher).toBe('PLAIN-VOUCHER-XYZ');
    });

    it('deve retornar success=false quando API não retorna voucher', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: { message: 'Nenhum voucher' },
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(false);
      expect(result.voucher).toBeUndefined();
    });

    it('deve retornar success=false quando API retorna null', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: null,
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(false);
    });

    it('deve retornar success=false quando API retorna 404 (email não está na campanha)', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Not Found',
      });

      const result = await campaignService.checkCampaignVoucher('notincampaign@example.com');
      expect(result.success).toBe(false);
    });

    it('deve retornar success=false quando ocorre erro de rede', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockRejectedValueOnce({
        message: 'Network Error',
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(false);
    });

    it('deve retornar success=false quando ocorre timeout', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockRejectedValueOnce({
        message: 'timeout of 10000ms exceeded',
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(false);
    });

    it('deve usar cache quando email é o mesmo e cache não expirou', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: { codigo: 'CACHED-VOUCHER' },
      });

      // Primeira chamada
      const result1 = await campaignService.checkCampaignVoucher('cache@example.com');
      expect(result1.success).toBe(true);
      expect(result1.voucher).toBe('CACHED-VOUCHER');

      // Segunda chamada - deve usar cache
      const result2 = await campaignService.checkCampaignVoucher('cache@example.com');
      expect(result2.success).toBe(true);
      expect(result2.voucher).toBe('CACHED-VOUCHER');

      // Axios deve ter sido chamado apenas uma vez
      expect(axiosMock.get).toHaveBeenCalledTimes(1);
    });

    it('deve não usar cache quando email é diferente', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get
        .mockResolvedValueOnce({ data: { codigo: 'VOUCHER-A' } })
        .mockResolvedValueOnce({ data: { codigo: 'VOUCHER-B' } });

      const result1 = await campaignService.checkCampaignVoucher('a@example.com');
      expect(result1.voucher).toBe('VOUCHER-A');

      const result2 = await campaignService.checkCampaignVoucher('b@example.com');
      expect(result2.voucher).toBe('VOUCHER-B');

      expect(axiosMock.get).toHaveBeenCalledTimes(2);
    });

    it('deve encodar o email na URL', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: { codigo: 'TEST' },
      });

      await campaignService.checkCampaignVoucher('user+test@example.com');

      expect(axiosMock.get).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('user+test@example.com')),
        expect.objectContaining({
          headers: { accept: '*/*' },
          params: { enviarNotificacao: false },
          timeout: 10000,
        })
      );
    });

    it('deve passar enviarNotificacao=true quando solicitado', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: { codigo: 'TEST' },
      });

      await campaignService.checkCampaignVoucher('user@example.com', true);

      expect(axiosMock.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { enviarNotificacao: true },
        })
      );
    });

    it('deve converter voucher para string quando é número', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: { codigo: 12345 },
      });

      const result = await campaignService.checkCampaignVoucher('user@example.com');
      expect(result.success).toBe(true);
      expect(result.voucher).toBe('12345');
      expect(typeof result.voucher).toBe('string');
    });

    it('deve cachear resultado negativo (sem voucher) também', async () => {
      const axiosMock = require('axios') as jest.Mocked<typeof axios>;
      axiosMock.get.mockResolvedValueOnce({
        data: { message: 'Sem voucher' },
      });

      const result1 = await campaignService.checkCampaignVoucher('novoucher@example.com');
      expect(result1.success).toBe(false);

      // Segunda chamada - deve usar cache
      const result2 = await campaignService.checkCampaignVoucher('novoucher@example.com');
      expect(result2.success).toBe(false);

      expect(axiosMock.get).toHaveBeenCalledTimes(1);
    });
  });
});
