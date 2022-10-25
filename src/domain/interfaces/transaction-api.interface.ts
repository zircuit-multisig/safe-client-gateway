import { Backbone } from '../backbone/entities/backbone.entity';
import { Balance } from '../balances/entities/balance.entity';
import { Page } from '../entities/page.entity';
import { Collectible } from '../collectibles/entities/collectible.entity';
import { MasterCopy } from '../chains/entities/master-copies.entity';
import { Safe } from '../safe/entities/safe.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { DataDecoded } from '../data-decoder/entities/data-decoded.entity';
import { Delegate } from '../delegate/entities/delegate.entity';
import { Transfer } from '../safe/entities/transfer.entity';
import { MultisigTransaction } from '../safe/entities/multisig-transaction.entity';

export interface ITransactionApi {
  getBalances(
    safeAddress: string,
    trusted?: boolean,
    excludeSpam?: boolean,
  ): Promise<Balance[]>;

  clearLocalBalances(safeAddress: string): Promise<void>;

  getDataDecoded(data: string, to: string): Promise<DataDecoded>;

  getCollectibles(
    safeAddress: string,
    limit?: number,
    offset?: number,
    trusted?: boolean,
    excludeSpam?: boolean,
  ): Promise<Page<Collectible>>;

  getBackbone(): Promise<Backbone>;

  getMasterCopies(): Promise<MasterCopy[]>;

  getSafe(safeAddress: string): Promise<Safe>;

  getContract(contractAddress: string): Promise<Contract>;

  getDelegates(
    safeAddress?: string,
    delegate?: string,
    delegator?: string,
    label?: string,
    limit?: number,
    offset?: number,
  ): Promise<Page<Delegate>>;

  postDelegates(
    safeAddress?: string,
    delegate?: string,
    delegator?: string,
    signature?: string,
    label?: string,
  ): Promise<unknown>;

  getTransfers(
    safeAddress: string,
    onlyErc20?: boolean,
    onlyErc721?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<Page<Transfer>>;

  getMultisigTransactions(
    safeAddress: string,
    ordering?: string,
    executed?: boolean,
    trusted?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<Page<MultisigTransaction>>;
}