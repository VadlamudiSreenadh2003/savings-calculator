import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SavingsCalculator = () => {
  const [name, setName] = useState("");
  const [packageLPA, setPackageLPA] = useState("");
  const [monthlySavingInput, setMonthlySavingInput] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState("monthly");

  const formatCurrency = (amount) =>
    Math.round(amount).toLocaleString("en-IN");

  const calculateSavings = (e) => {
    e.preventDefault();

    const lpa = Number(packageLPA);
    const monthlySaving = Number(monthlySavingInput);
    const totalYears = Number(years);

    // ✅ Annual & Monthly CTC
    const annualCTC = lpa * 100000;
    const monthlyCTC = annualCTC / 12;

    // ✅ Reverse Employer PF from CTC to get TRUE GROSS
    // Employer PF = 12% of Basic
    // Basic = 40% of Gross
    // Employer PF = 0.12 × 0.40 × Gross = 0.048 × Gross
    // CTC = Gross + Employer PF = 1.048 × Gross
    const grossMonthly = monthlyCTC / 1.048;

    // ✅ Basic Salary (40% of Gross)
    const basicMonthly = grossMonthly * 0.4;

    // ✅ Employee PF (12% of Basic)
    const monthlyEmployeePF = basicMonthly * 0.12;
    const yearlyEmployeePF = monthlyEmployeePF * 12;

    // ✅ Employer PF (for display)
    const monthlyEmployerPF = monthlyEmployeePF;
    const yearlyEmployerPF = yearlyEmployeePF;

    // ✅ Net In-Hand Salary
    const netMonthly = grossMonthly - monthlyEmployeePF;

    // ✅ Savings
    const yearlySaving = monthlySaving * 12;
    const totalSaving = yearlySaving * totalYears;

    setResult({
      annualCTC,
      monthlyCTC,
      grossMonthly,
      basicMonthly,
      monthlyEmployeePF,
      yearlyEmployeePF,
      monthlyEmployerPF,
      yearlyEmployerPF,
      netMonthly,
      monthlySaving,
      yearlySaving,
      totalSaving,
    });
  };

  const resetForm = () => {
    setName("");
    setPackageLPA("");
    setMonthlySavingInput("");
    setYears("");
    setResult(null);
  };

  const doughnutData = result && {
    labels: ["Monthly Saving", "Employee PF", "Remaining Balance"],
    datasets: [
      {
        data: [
          result.monthlySaving,
          result.monthlyEmployeePF,
          result.netMonthly - result.monthlySaving,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center g-4">

        {/* LEFT FORM */}
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-3">Savings + PF Calculator</h2>

            <form onSubmit={calculateSavings}>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Package (LPA)</label>
                <input
                  type="number"
                  className="form-control"
                  value={packageLPA}
                  onChange={(e) => setPackageLPA(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Monthly Saving (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={monthlySavingInput}
                  onChange={(e) => setMonthlySavingInput(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Number of Years</label>
                <input
                  type="number"
                  className="form-control"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-2">
                Calculate
              </button>

              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={resetForm}
              >
                Reset
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT RESULT */}
        <div className="col-md-6">
          <div className="p-4 shadow border">

            <div className="d-flex justify-content-center mb-3 gap-2">
              <button
                className={`btn ${viewMode === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setViewMode("monthly")}
              >
                Monthly
              </button>

              <button
                className={`btn ${viewMode === "yearly" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setViewMode("yearly")}
              >
                Yearly
              </button>
            </div>

            <h3 className="text-center mb-3">
              {viewMode === "monthly" ? "Monthly Results" : "Yearly Results"}
            </h3>

            <div className="row align-items-center">
              <div className="col-md-7">

                <h5 className="text-center text-primary mb-3">
                  {result ? `Hello, ${name} 👋` : "Hello 👋"}
                </h5>

                {/* ✅ MONTHLY VIEW */}
                {viewMode === "monthly" && result && (
                  <>
                    <p><b>CTC (Monthly):</b> ₹ {formatCurrency(result.monthlyCTC)}</p>
                    <p><b>True Gross:</b> ₹ {formatCurrency(result.grossMonthly)}</p>
                    <p><b>Basic (40%):</b> ₹ {formatCurrency(result.basicMonthly)}</p>
                    <p><b>Employee PF:</b> ₹ {formatCurrency(result.monthlyEmployeePF)}</p>
                    <p><b>Employer PF:</b> ₹ {formatCurrency(result.monthlyEmployerPF)}</p>
                    <p><b>Net In-Hand:</b> ₹ {formatCurrency(result.netMonthly)}</p>
                    <p><b>Monthly Saving:</b> ₹ {formatCurrency(result.monthlySaving)}</p>

                    <h5 className="text-center mt-3">Remaining Balance</h5>
                    <h3 className="text-center text-success">
                      ₹ {formatCurrency(result.netMonthly - result.monthlySaving)}
                    </h3>
                  </>
                )}

                {/* ✅ YEARLY VIEW */}
                {viewMode === "yearly" && result && (
                  <>
                    <p><b>Annual CTC:</b> ₹ {formatCurrency(result.annualCTC)}</p>
                    <p><b>Yearly Employee PF:</b> ₹ {formatCurrency(result.yearlyEmployeePF)}</p>
                    <p><b>Yearly Employer PF:</b> ₹ {formatCurrency(result.yearlyEmployerPF)}</p>
                    <p><b>Yearly Saving:</b> ₹ {formatCurrency(result.yearlySaving)}</p>

                    <h5 className="text-center mt-3">
                      Total Saving After {years} Years
                    </h5>

                    <h3 className="text-center text-success">
                      ₹ {formatCurrency(result.totalSaving)}
                    </h3>
                  </>
                )}

              </div>

              {/* ✅ PIE CHART */}
              <div className="col-md-5 text-center">
                {result ? (
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                ) : (
                  <p className="text-muted">Submit to view chart</p>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SavingsCalculator;


// import React, { useState } from "react";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);


// const SavingsCalculator = () => {
//   const [name, setName] = useState("");
//   const [packageLPA, setPackageLPA] = useState("");
//   const [monthlySavingInput, setMonthlySavingInput] = useState("");
//   const [years, setYears] = useState("");
//   const [result, setResult] = useState(null);
//   const [viewMode, setViewMode] = useState("monthly"); // monthly | yearly

//   // ✅ Currency Formatter (₹ with commas)
//   const formatCurrency = (amount) => {
//     return amount.toLocaleString("en-IN");
//   };

//   const calculateSavings = (e) => {
//     e.preventDefault();

//     const lpa = Number(packageLPA);
//     const monthlySaving = Number(monthlySavingInput);
//     const totalYears = Number(years);

//     const annualSalary = lpa * 100000;
//     const grossMonthly = annualSalary / 12;

//     const monthlyDeduction = grossMonthly * 0.1; // 10% deduction
//     const netMonthly = grossMonthly - monthlyDeduction;

//     const yearlySaving = monthlySaving * 12;
//     const totalSaving = yearlySaving * totalYears;

//     setResult({
//       annualSalary: Math.round(annualSalary),
//       grossMonthly: Math.round(grossMonthly),
//       monthlyDeduction: Math.round(monthlyDeduction),
//       netMonthly: Math.round(netMonthly),
//       monthlySaving: Math.round(monthlySaving),
//       yearlySaving: Math.round(yearlySaving),
//       totalSaving: Math.round(totalSaving),
//     });
//   };

//   const resetForm = () => {
//     setName("");
//     setPackageLPA("");
//     setMonthlySavingInput("");
//     setYears("");
//     setResult(null);
//   };

//   // ✅ DOUGHNUT CHART DATA
//   const doughnutData = result && {
//     labels: ["Monthly Saving", "Monthly Deduction", "Remaining Balance"],
//     datasets: [
//       {
//         data: [
//           result.monthlySaving,
//           result.monthlyDeduction,
//           result.netMonthly - result.monthlySaving,
//         ],
//         backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
//         hoverOffset: 8,
//       },
//     ],
//   };

//   const doughnutOptions = {
//     responsive: true,
//     animation: {
//       animateRotate: true,
//       duration: 1200,
//     },
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//     },
//   };

//   return (
//     <div className="container mt-4">
//       <div className="row justify-content-center g-4">

//         {/* ✅ LEFT CARD - FORM */}
//         <div className="col-md-5">
//           <div className="card p-4 shadow">
//             <h2 className="text-center mb-3">Savings Calculator</h2>

//             <form onSubmit={calculateSavings}>

//               {/* ✅ NAME FIELD */}
//               <div className="mb-3">
//                 <label className="form-label">Your Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Package (LPA)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={packageLPA}
//                   onChange={(e) => setPackageLPA(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Monthly Saving (₹)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={monthlySavingInput}
//                   onChange={(e) => setMonthlySavingInput(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Number of Years</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={years}
//                   onChange={(e) => setYears(e.target.value)}
//                   required
//                 />
//               </div>

//               <button type="submit" className="btn btn-primary w-100 mb-2">
//                 Calculate
//               </button>

//               <button
//                 type="button"
//                 className="btn btn-outline-danger w-100"
//                 onClick={resetForm}
//               >
//                 Reset
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* ✅ RIGHT CARD - RESULT + CHART WITH MONTHLY / YEARLY TOGGLE */}
//         <div className="col-md-6">
//           <div className="p-4 shadow border">

//             {/* ✅ TOGGLE BUTTONS */}
//             <div className="d-flex justify-content-center mb-3 gap-2">
//               <button
//                 className={`btn ${viewMode === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
//                 onClick={() => setViewMode("monthly")}
//               >
//                 Monthly
//               </button>

//               <button
//                 className={`btn ${viewMode === "yearly" ? "btn-success" : "btn-outline-success"}`}
//                 onClick={() => setViewMode("yearly")}
//               >
//                 Yearly
//               </button>
//             </div>

//             <h3 className="text-center mb-3">
//               {viewMode === "monthly" ? "Monthly Results" : "Yearly Results"}
//             </h3>

//             <div className="row align-items-center">

//               {/* ✅ RESULT TEXT */}
//               <div className="col-md-7">
//                 <div className="result">

//                   <h5 className="text-center text-primary mb-3">
//                     {result ? `Hello, ${name} 👋` : "Hello 👋"}
//                   </h5>

//                   {/* ✅ MONTHLY VIEW */}
//                   {viewMode === "monthly" && (
//                     <>
//                       <p><b>Gross Monthly Salary:</b> ₹ {result ? formatCurrency(result.grossMonthly) : "—"}</p>
//                       <p><b>Monthly Deduction (10%):</b> ₹ {result ? formatCurrency(result.monthlyDeduction) : "—"}</p>
//                       <p><b>Net Monthly In-Hand:</b> ₹ {result ? formatCurrency(result.netMonthly) : "—"}</p>
//                       <p><b>Monthly Saving:</b> ₹ {result ? formatCurrency(result.monthlySaving) : "—"}</p>

//                       <h5 className="text-center mt-3">
//                         Remaining Balance
//                       </h5>

//                       <h3 className="text-center text-success">
//                         ₹ {result ? formatCurrency(result.netMonthly - result.monthlySaving) : "—"}
//                       </h3>
//                     </>
//                   )}

//                   {/* ✅ YEARLY VIEW */}
//                   {viewMode === "yearly" && (
//                     <>
//                       <p><b>Annual Salary:</b> ₹ {result ? formatCurrency(result.annualSalary) : "—"}</p>
//                       <p><b>Yearly Saving:</b> ₹ {result ? formatCurrency(result.yearlySaving) : "—"}</p>

//                       <h5 className="text-center mt-3">
//                         Total Saving After {years || "—"} Years
//                       </h5>

//                       <h3 className="text-center text-success">
//                         ₹ {result ? formatCurrency(result.totalSaving) : "—"}
//                       </h3>
//                     </>
//                   )}

//                 </div>
//               </div>

//               {/* ✅ PIE CHART BESIDE RESULT */}
//               <div className="col-md-5 text-center">
//                 <h6 className="mb-2">
//                   {viewMode === "monthly" ? "Monthly Distribution" : "Yearly Distribution"}
//                 </h6>

//                 {result ? (
//                   <Doughnut data={doughnutData} options={doughnutOptions} />
//                 ) : (
//                   <p className="text-muted">Submit to view chart</p>
//                 )}
//               </div>

//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default SavingsCalculator;

// import React, { useState } from "react";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const SavingsCalculator = () => {
//   const [name, setName] = useState("");
//   const [packageLPA, setPackageLPA] = useState("");
//   const [monthlySavingInput, setMonthlySavingInput] = useState("");
//   const [years, setYears] = useState("");
//   const [result, setResult] = useState(null);
//   const [viewMode, setViewMode] = useState("monthly");

//   const formatCurrency = (amount) => amount.toLocaleString("en-IN");

//   // ✅ NO PF – ONLY BASIC SALARY & SAVINGS
//   const calculateSavings = (e) => {
//     e.preventDefault();

//     const lpa = Number(packageLPA);
//     const monthlySaving = Number(monthlySavingInput);
//     const totalYears = Number(years);

//     const annualSalary = lpa * 100000;
//     const grossMonthly = annualSalary / 12;

//     // ✅ Net In-Hand = Gross (NO DEDUCTION)
//     const netMonthly = grossMonthly;

//     const yearlySaving = monthlySaving * 12;
//     const totalSaving = yearlySaving * totalYears;

//     setResult({
//       annualSalary: Math.round(annualSalary),
//       grossMonthly: Math.round(grossMonthly),
//       netMonthly: Math.round(netMonthly),
//       monthlySaving: Math.round(monthlySaving),
//       yearlySaving: Math.round(yearlySaving),
//       totalSaving: Math.round(totalSaving),
//     });
//   };

//   const resetForm = () => {
//     setName("");
//     setPackageLPA("");
//     setMonthlySavingInput("");
//     setYears("");
//     setResult(null);
//   };

//   // ✅ PIE CHART (ONLY SAVING + BALANCE)
//   const doughnutData = result && {
//     labels: ["Monthly Saving", "Remaining Balance"],
//     datasets: [
//       {
//         data: [
//           result.monthlySaving,
//           result.netMonthly - result.monthlySaving,
//         ],
//         backgroundColor: ["#4caf50", "#2196f3"],
//       },
//     ],
//   };

//   const doughnutOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//     },
//   };

//   return (
//     <div className="container mt-4">
//       <div className="row justify-content-center g-4">

//         {/* ✅ LEFT CARD */}
//         <div className="col-md-5">
//           <div className="card p-4 shadow">
//             <h2 className="text-center mb-3">Savings Calculator</h2>

//             <form onSubmit={calculateSavings}>
//               <div className="mb-3">
//                 <label className="form-label">Your Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Package (LPA)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={packageLPA}
//                   onChange={(e) => setPackageLPA(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Monthly Saving (₹)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={monthlySavingInput}
//                   onChange={(e) => setMonthlySavingInput(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Number of Years</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={years}
//                   onChange={(e) => setYears(e.target.value)}
//                   required
//                 />
//               </div>

//               <button type="submit" className="btn btn-primary w-100 mb-2">
//                 Calculate
//               </button>

//               <button
//                 type="button"
//                 className="btn btn-outline-danger w-100"
//                 onClick={resetForm}
//               >
//                 Reset
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* ✅ RIGHT CARD */}
//         <div className="col-md-6">
//           <div className="p-4 shadow border">

//             {/* ✅ TOGGLE */}
//             <div className="d-flex justify-content-center mb-3 gap-2">
//               <button
//                 className={`btn ${viewMode === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
//                 onClick={() => setViewMode("monthly")}
//               >
//                 Monthly
//               </button>
//               <button
//                 className={`btn ${viewMode === "yearly" ? "btn-success" : "btn-outline-success"}`}
//                 onClick={() => setViewMode("yearly")}
//               >
//                 Yearly
//               </button>
//             </div>

//             <h3 className="text-center mb-3">
//               {viewMode === "monthly" ? "Monthly Results" : "Yearly Results"}
//             </h3>

//             <div className="row align-items-center">
//               <div className="col-md-7">
//                 <h5 className="text-center text-primary mb-3">
//                   {result ? `Hello, ${name} 👋` : "Hello 👋"}
//                 </h5>

//                 {viewMode === "monthly" && (
//                   <>
//                     <p><b>Gross Monthly:</b> ₹ {result ? formatCurrency(result.grossMonthly) : "—"}</p>
//                     <p><b>Net In-Hand:</b> ₹ {result ? formatCurrency(result.netMonthly) : "—"}</p>
//                     <p><b>Monthly Saving:</b> ₹ {result ? formatCurrency(result.monthlySaving) : "—"}</p>

//                     <h5 className="text-center mt-3">Remaining Balance</h5>
//                     <h3 className="text-center text-success">
//                       ₹ {result ? formatCurrency(result.netMonthly - result.monthlySaving) : "—"}
//                     </h3>
//                   </>
//                 )}

//                 {viewMode === "yearly" && (
//                   <>
//                     <p><b>Annual Salary:</b> ₹ {result ? formatCurrency(result.annualSalary) : "—"}</p>
//                     <p><b>Yearly Saving:</b> ₹ {result ? formatCurrency(result.yearlySaving) : "—"}</p>

//                     <h5 className="text-center mt-3">
//                       Total Saving After {years || "—"} Years
//                     </h5>
//                     <h3 className="text-center text-success">
//                       ₹ {result ? formatCurrency(result.totalSaving) : "—"}
//                     </h3>
//                   </>
//                 )}
//               </div>

//               <div className="col-md-5 text-center">
//                 <h6 className="mb-2">
//                   {viewMode === "monthly" ? "Monthly Distribution" : "Yearly Distribution"}
//                 </h6>

//                 {result ? (
//                   <Doughnut data={doughnutData} options={doughnutOptions} />
//                 ) : (
//                   <p className="text-muted">Submit to view chart</p>
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default SavingsCalculator;
