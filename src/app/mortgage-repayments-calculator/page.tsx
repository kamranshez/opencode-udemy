import type { Metadata } from "next"
import { MortgageCalculator } from "./_components/mortgage-calculator"

export const metadata: Metadata = {
  title: "Mortgage Repayments Calculator",
  description:
    "Calculate your monthly, fortnightly, or weekly mortgage repayments. See a full amortisation breakdown with our free mortgage calculator.",
}

export default function Page() {
  return <MortgageCalculator />
}
