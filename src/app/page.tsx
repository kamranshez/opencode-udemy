import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-end px-6 py-4">
        <ThemeToggle />
      </header>
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center md:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Smart Financial{" "}
          <span className="text-muted-foreground">Calculators</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          Make informed decisions about your mortgage and investments with our
          easy-to-use calculators. Fast, accurate, and completely free.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#mortgage" />}
          >
            Mortgage Calculator
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href="#compound" />}
          >
            Compound Interest
          </Button>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-20 md:grid-cols-2">
          <FeatureCard
            id="mortgage"
            title="Mortgage Repayments Calculator"
            description="Calculate your monthly mortgage repayments based on loan amount, interest rate, and term. See a full amortisation breakdown so you know exactly where your money goes."
            items={[
              "Monthly & total repayment estimates",
              "Adjustable loan term and interest rate",
              "Clear amortisation schedule",
            ]}
            href="/mortgage-repayments-calculator"
            cta="Try Mortgage Calculator"
          />
          <FeatureCard
            id="compound"
            title="Compound Interest Calculator"
            description="See how your savings grow over time with compound interest. Adjust the initial deposit, contribution amount, interest rate, and compounding frequency."
            items={[
              "Future value projections",
              "Regular contribution modelling",
              "Flexible compounding periods",
            ]}
            href="/compound"
            cta="Try Compound Interest Calculator"
          />
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Start planning your financial future today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          No sign-up required. Our calculators are free to use and work on any
          device.
        </p>
        <Button
          size="lg"
          className="mt-8"
          nativeButton={false}
          render={<a href="#mortgage" />}
        >
          Get Started
        </Button>
      </section>
    </div>
  );
}

function FeatureCard({
  id,
  title,
  description,
  items,
  href,
  cta,
}: {
  id: string;
  title: string;
  description: string;
  items: string[];
  href: string;
  cta: string;
}) {
  return (
    <div
      id={id}
      className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-sm"
    >
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#10003;</span>
            {item}
          </li>
        ))}
      </ul>
      <Button
        className="mt-auto"
        nativeButton={false}
        render={<a href={href} />}
      >
        {cta}
      </Button>
    </div>
  );
}
