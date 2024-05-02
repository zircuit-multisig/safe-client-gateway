import { SwapOrderMapper } from '@/routes/transactions/mappers/common/swap-order.mapper';
import { SetPreSignatureDecoder } from '@/domain/swaps/contracts/decoders/set-pre-signature-decoder.helper';
import { SwapOrderHelper } from '@/routes/transactions/helpers/swap-order.helper';
import { ILoggingService } from '@/logging/logging.interface';
import { chainBuilder } from '@/domain/chains/entities/__tests__/chain.builder';
import { setPreSignatureEncoder } from '@/domain/swaps/contracts/__tests__/encoders/set-pre-signature-encoder.builder';
import { orderBuilder } from '@/domain/swaps/entities/__tests__/order.builder';
import { tokenBuilder } from '@/domain/tokens/__tests__/token.builder';

const loggingService = {
  debug: jest.fn(),
} as jest.MockedObjectDeep<ILoggingService>;
const mockLoggingService = jest.mocked(loggingService);

const swapOrderHelper = {
  getOrder: jest.fn(),
  isAppAllowed: jest.fn(),
  getOrderExplorerUrl: jest.fn(),
} as jest.MockedObjectDeep<SwapOrderHelper>;
const mockSwapOrderHelper = jest.mocked(swapOrderHelper);

describe('SwapOrderMapper', () => {
  let target: SwapOrderMapper;

  beforeEach(() => {
    target = new SwapOrderMapper(
      new SetPreSignatureDecoder(mockLoggingService),
      mockSwapOrderHelper,
    );
  });

  it('foo', async () => {
    const chain = chainBuilder().build();
    const encoder = setPreSignatureEncoder();
    const { orderUid } = encoder.build();
    const order = orderBuilder().build();
    const sellToken = tokenBuilder().with('address', order.sellToken).build();
    const buyToken = tokenBuilder().with('address', order.buyToken).build();

    if (!sellToken.decimals || !buyToken.decimals) throw new Error();

    mockSwapOrderHelper.getOrder.mockResolvedValue({
      order,
      sellToken,
      buyToken,
    });

    const actual = await target.mapSwapOrder(chain.chainId, {
      data: encoder.encode(),
    });
  });
});
