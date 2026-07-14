"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

type Frequency = "monthly" | "fortnightly" | "weekly"

const FREQ_LABELS: Record<Frequency, string> = {
  monthly: "Monthly",
  fortnightly: "Fortnightly",
  weekly: "Weekly",
}

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
}

type AmortisationRow = {
  year: number
  payment: number
  interest: number
  principal: number
  balance: number
}

function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number,
  frequency: Frequency,
) {
  const periodsPerYear = PERIODS_PER_YEAR[frequency]
  const totalPayments = years * periodsPerYear
  const periodicRate = annualRate / 100 / periodsPerYear

  if (periodicRate === 0) {
    const payment = principal / totalPayments
    return { payment, totalInterest: 0, totalPaid: principal, schedule: [] }
  }

  const compoundFactor = Math.pow(1 + periodicRate, totalPayments)
  const payment = principal * (periodicRate * compoundFactor) / (compoundFactor - 1)
  const totalPaid = payment * totalPayments
  const totalInterest = totalPaid - principal

  let balance = principal
  const schedule: AmortisationRow[] = []

  for (let year = 1; year <= years; year++) {
    let yearlyInterest = 0
    let yearlyPrincipal = 0
    const paymentsThisYear = periodsPerYear

    for (let p = 0; p < paymentsThisYear; p++) {
      const interestPortion = balance * periodicRate
      const principalPortion = payment - interestPortion
      yearlyInterest += interestPortion
      yearlyPrincipal += principalPortion
      balance -= principalPortion
    }

    schedule.push({
      year,
      payment: Math.round(payment * paymentsThisYear),
      interest: Math.round(yearlyInterest),
      principal: Math.round(yearlyPrincipal),
      balance: Math.round(Math.max(balance, 0)),
    })
  }

  return { payment, totalInterest, totalPaid, schedule }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCurrencyExact(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function MortgageCalculator() {
  const [principal, setPrincipal] = useState("500000")
  const [rate, setRate] = useState("6")
  const [years, setYears] = useState("30")
  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const [result, setResult] = useState<{
    payment: number
    totalInterest: number
    totalPaid: number
    schedule: AmortisationRow[]
  } | null>(null)

  function handleCalculate() {
    const p = parseFloat(principal)
    const r = parseFloat(rate)
    const y = parseFloat(years)

    if (!p || !r || !y || p <= 0 || r <= 0 || y <= 0) return

    setResult(calculateMortgage(p, r, y, frequency))
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mortgage Repayments Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Calculate your regular mortgage repayments and see a full amortisation
          breakdown.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>
              Enter your loan information to calculate repayments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="principal">Loan Amount</FieldLabel>
                <Input
                  id="principal"
                  type="number"
                  min={0}
                  placeholder="e.g. 500000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="rate">Interest Rate (% p.a.)</FieldLabel>
                <Input
                  id="rate"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="e.g. 6"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="years">Loan Term (years)</FieldLabel>
                <Input
                  id="years"
                  type="number"
                  min={1}
                  placeholder="e.g. 30"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Repayment Frequency</FieldLabel>
                <ToggleGroup
                  defaultValue={["monthly"]}
                  value={[frequency]}
                  onValueChange={(v) => {
                    if (v.length > 0) setFrequency(v[0] as Frequency)
                  }}
                  spacing={2}
                >
                  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                  <ToggleGroupItem value="fortnightly">Fortnightly</ToggleGroupItem>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                </ToggleGroup>
              </Field>

              <Button className="mt-2" onClick={handleCalculate}>
                Calculate
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        {result && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Repayment Summary</CardTitle>
                <CardDescription>
                  {FREQ_LABELS[frequency]} repayments over {years} years at{" "}
                  {rate}% p.a.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {FREQ_LABELS[frequency]} Repayment
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrencyExact(result.payment)}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Interest Paid
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(result.totalInterest)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount Paid
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(result.totalPaid)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amortisation Schedule</CardTitle>
                <CardDescription>
                  Year-by-year breakdown of principal and interest.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2 pr-4 text-left font-medium">Year</th>
                        <th className="py-2 pr-4 text-right font-medium">Payment</th>
                        <th className="py-2 pr-4 text-right font-medium">Interest</th>
                        <th className="py-2 pr-4 text-right font-medium">Principal</th>
                        <th className="py-2 text-right font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.year} className="border-b border-border/50 last:border-0">
                          <td className="py-2 pr-4 text-left">{row.year}</td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="py-2 text-right">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
