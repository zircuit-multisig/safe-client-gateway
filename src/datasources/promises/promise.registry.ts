import { Inject, Injectable, Module } from '@nestjs/common';
import { IConfigurationService } from '@/config/configuration.service.interface';

@Injectable()
export class PromiseRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registry: Map<string, Promise<any>> = new Map();

  private readonly isPromiseRegistryEnabled: boolean =
    this.configurationService.getOrThrow<boolean>('features.promiseRegistry');

  constructor(
    @Inject(IConfigurationService)
    private readonly configurationService: IConfigurationService,
  ) {}

  getOrCreate<T>(key: string, promiseFactory: () => Promise<T>): Promise<T> {
    if (!this.isPromiseRegistryEnabled) return promiseFactory();
    if (!this.registry.has(key)) {
      const promise = promiseFactory().finally(() => {
        this.registry.delete(key);
      });
      this.registry.set(key, promise);
      return promise;
    }
    return this.registry.get(key)!;
  }
}

@Module({
  providers: [PromiseRegistry],
  exports: [PromiseRegistry],
})
export class PromiseRegistryModule {}
