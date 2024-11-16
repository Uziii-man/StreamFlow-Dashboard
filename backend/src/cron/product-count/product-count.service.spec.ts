import { Test, TestingModule } from '@nestjs/testing';
import { ProductCountService } from './product-count.service';

describe('ProductCountService', () => {
  let service: ProductCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCountService],
    }).compile();

    service = module.get<ProductCountService>(ProductCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
