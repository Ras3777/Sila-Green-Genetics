import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module.js';
import { GeneticsModule } from './genetics/genetics.module.js';
import { GovernmentModule } from './government/government.module.js';
import { HealthModule } from './health/health.module.js';
import { MarketplaceModule } from './marketplace/marketplace.module.js';
import { MediaModule } from './media/media.module.js';
import { OpsModule } from './ops/ops.module.js';
import { ReproductionModule } from './reproduction/reproduction.module.js';
import { TrustModule } from './trust/trust.module.js';

@Module({
  imports: [
    CoreModule,
    GeneticsModule,
    GovernmentModule,
    HealthModule,
    MarketplaceModule,
    MediaModule,
    OpsModule,
    ReproductionModule,
    TrustModule,
  ],
})
export class ModulesModule {}
