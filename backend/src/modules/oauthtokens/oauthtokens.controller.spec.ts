import { Test, TestingModule } from '@nestjs/testing';
import { OauthtokensController } from './oauthtokens.controller';

describe('OauthtokensController', () => {
  let controller: OauthtokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthtokensController],
    }).compile();

    controller = module.get<OauthtokensController>(OauthtokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
