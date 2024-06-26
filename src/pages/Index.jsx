import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Input, Slider, SliderTrack, SliderFilledTrack, SliderThumb, useNumberInput, HStack, Button } from "@chakra-ui/react";
import ResultsCard from "../components/ResultsCard";

const Index = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(1500);
  const [savingsRate, setSavingsRate] = useState(Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100));
  const [investmentReturn, setInvestmentReturn] = useState(9);

  useEffect(() => {
    setSavingsRate(Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100));
  }, [monthlyIncome, monthlyExpenses]);

  useEffect(() => {
    setMonthlyExpenses(monthlyIncome * (1 - savingsRate / 100));
  }, [monthlyIncome, savingsRate]);

  const { getInputProps: getReturnInputProps } = useNumberInput({
    step: 0.1,
    defaultValue: 9,
    min: 2,
    max: 12,
    precision: 1,
    value: investmentReturn,
    onChange: (val) => setInvestmentReturn(val),
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap&family=Inter:wght@100..900";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [retirementData, setRetirementData] = useState(null);

  const calculateRetirement = () => {
    const monthlySavings = monthlyIncome * (savingsRate / 100);
    const annualSavings = monthlySavings * 12;
    const initialSavings = 0;
    const safeWithdrawalRate = 0.04;
    const annualInvestmentReturn = investmentReturn / 100;
    let totalSavings = initialSavings;
    let yearsToRetire = 0;

    while (totalSavings < (monthlyExpenses * 12) / safeWithdrawalRate) {
      totalSavings = (totalSavings + annualSavings) * (1 + annualInvestmentReturn);
      yearsToRetire++;
    }

    // The incorrect calculation block is removed.

    const monthlySpending = (totalSavings * safeWithdrawalRate) / 12;
    const totalSavingsAtRetirement = totalSavings;

    setRetirementData({
      monthlySavings,
      yearsToRetire,
      totalSavingsAtRetirement,
      monthlySpending,
    });
    setIsSubmitted(true);
  };

  return (
    <Box p={8} maxWidth="600px" mx="auto" bg="white" borderRadius="md" boxShadow="md" mt={8}>
      <Heading as="h1" size="2xl" mb={4} textAlign="center" fontFamily="Inter" fontWeight="black">
        When will I retire?💰
      </Heading>
      <Text fontSize="xl" mb={8}>
        See how long until you can retire based on your income, expenses and savings rate.🌴
        <Text fontFamily="'Gloria Hallelujah', cursive" mt={4}>
          Change the settings as you like!
        </Text>
      </Text>

      <Box mb={4}>
        <Text mb={2}>Monthly Income</Text>
        <Input
          type="number"
          value={monthlyIncome}
          onChange={(e) => {
            const newMonthlyIncome = e.target.value;
            setMonthlyIncome(newMonthlyIncome);
            setSavingsRate(Math.round(((newMonthlyIncome - monthlyExpenses) / newMonthlyIncome) * 100));
          }}
        />
      </Box>

      <Box mb={4}>
        <Text mb={2}>Monthly Expenses: ${monthlyExpenses.toLocaleString()}</Text>
      </Box>

      <Box mb={8}>
        <Text mb={2}>Savings Rate: {savingsRate}%</Text>
        <Slider
          value={savingsRate}
          min={0}
          max={100}
          step={1}
          onChange={(val) => {
            setSavingsRate(val);
            setMonthlyExpenses(monthlyIncome * (1 - val / 100));
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text>
          With monthly expenses of ${monthlyExpenses.toLocaleString()}, you are saving ${(monthlyIncome * (savingsRate / 100)).toLocaleString()} per month.
        </Text>
      </Box>

      <Box mb={8}>
        <Text mb={2}>Investment Return: {investmentReturn}%</Text>
        <HStack>
          <Slider
            value={investmentReturn}
            min={0}
            max={100}
            step={1}
            onChange={(val) => {
              setInvestmentReturn(val);
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Input {...getReturnInputProps()} width="100px" />
        </HStack>
      </Box>

      <Button colorScheme="green" size="lg" onClick={calculateRetirement} mt={8} mx="auto" display="block">
        Calculate
      </Button>

      {isSubmitted && <ResultsCard yearsToRetire={retirementData.yearsToRetire} savingsRate={savingsRate} investmentReturn={investmentReturn} monthlySpending={retirementData.monthlySpending} monthlySavings={retirementData.monthlySavings} totalSavingsAtRetirement={retirementData.totalSavingsAtRetirement} />}
    </Box>
  );
};

export default Index;
