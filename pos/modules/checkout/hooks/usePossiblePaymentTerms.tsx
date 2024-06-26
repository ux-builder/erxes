import useGolomt from "@/modules/checkout/hooks/useGolomt"
import useKhanCard from "@/modules/checkout/hooks/useKhanCard"
import useTDB from "@/modules/checkout/hooks/useTDB"
import { paymentIdsAtom } from "@/store/config.store"
import { unPaidAmountAtom } from "@/store/order.store"
import { useAtomValue } from "jotai"

import useCapitron from "./useCapitron"
import { useCheckNotSplit } from "./usePaymentType"

const usePossiblePaymentTerms = () => {
  const notPaidAmount = useAtomValue(unPaidAmountAtom)
  const { loading: loadingKhan, isAlive: khan } = useKhanCard()
  const { paymentType: tdb } = useTDB()
  const { paymentType: capitron } = useCapitron()
  const { isIncluded: golomt } = useGolomt()
  const { mappedPts, paidNotSplit } = useCheckNotSplit()
  const paymentIds = useAtomValue(paymentIdsAtom)

  const disabledTerms = !!paidNotSplit

  return {
    loadingKhan,
    disabledTerms,
    paymentIds,
    khan,
    tdb,
    capitron,
    golomt,
    mappedPts,
    notPaidAmount,
  }
}

export default usePossiblePaymentTerms
