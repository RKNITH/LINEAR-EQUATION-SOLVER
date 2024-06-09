document.addEventListener("DOMContentLoaded", function () {
    const addEquationButton = document.getElementById("addEquationButton");
    const solveButton = document.getElementById("solveButton");
    const equationInputsDiv = document.getElementById("equationInputs");
    const equationResult = document.getElementById("equationResult");

    let equationCount = 0;

    addEquationButton.addEventListener("click", function () {
        equationCount++;
        createEquationInputs();
    });

    solveButton.addEventListener("click", solveLinearEquations);

    function createEquationInputs() {
        const equationDiv = document.createElement("div");
        equationDiv.classList.add("equation");
        equationDiv.innerHTML = `
            <div class="equation-text">Equation ${equationCount}:</div>
            <input type="text" class="coefficient" placeholder="Coefficient of x">
            <input type="text" class="coefficient" placeholder="Coefficient of y">
            <input type="text" class="coefficient" placeholder="Coefficient of z">
            <input type="text" class="constant" placeholder="Constant term">
        `;
        equationInputsDiv.appendChild(equationDiv);
    }

    function solveLinearEquations() {
        equationResult.innerHTML = ""; // Clear previous results

        const equations = document.querySelectorAll(".equation");
        const coefficients = [];
        const constants = [];

        equations.forEach(equation => {
            const coefficientInputs = equation.querySelectorAll(".coefficient");
            const equationCoefficients = Array.from(coefficientInputs).map(input => parseFloat(input.value));
            coefficients.push(equationCoefficients);

            const constantInput = equation.querySelector(".constant");
            constants.push(parseFloat(constantInput.value));
        });

        // Validate input
        if (coefficients.some(eq => eq.length !== 3) || constants.some(isNaN)) {
            equationResult.textContent = "Please enter valid coefficients and constants.";
            return;
        }

        // Solve equations
        const result = solveEquations(coefficients, constants);
        if (result) {
            equationResult.textContent = `Solution: x = ${result.x.toFixed(4)}, y = ${result.y.toFixed(4)}, z = ${result.z.toFixed(4)}`;
        } else {
            equationResult.textContent = "No unique solution found.";
        }
    }

    function solveEquations(coefficients, constants) {
        const determinant =
            coefficients[0][0] * (coefficients[1][1] * coefficients[2][2] - coefficients[1][2] * coefficients[2][1]) -
            coefficients[0][1] * (coefficients[1][0] * coefficients[2][2] - coefficients[1][2] * coefficients[2][0]) +
            coefficients[0][2] * (coefficients[1][0] * coefficients[2][1] - coefficients[1][1] * coefficients[2][0]);

        if (determinant === 0) {
            return null; // No unique solution
        }

        const x = (
            (constants[0] * (coefficients[1][1] * coefficients[2][2] - coefficients[1][2] * coefficients[2][1])) -
            (coefficients[0][1] * (constants[1] * coefficients[2][2] - coefficients[1][2] * constants[2])) +
            (coefficients[0][2] * (constants[1] * coefficients[2][1] - coefficients[1][1] * constants[2]))
        ) / determinant;

        const y = (
            -(coefficients[0][0] * (constants[1] * coefficients[2][2] - coefficients[1][2] * constants[2])) +
            (constants[0] * (coefficients[1][0] * coefficients[2][2] - coefficients[1][2] * coefficients[2][0])) -
            (coefficients[0][2] * (coefficients[1][0] * constants[2] - constants[1] * coefficients[2][0]))
        ) / determinant;

        const z = (
            (coefficients[0][0] * (coefficients[1][1] * constants[2] - constants[1] * coefficients[2][1])) -
            (coefficients[0][1] * (coefficients[1][0] * constants[2] - constants[1] * coefficients[2][0])) +
            (constants[0] * (coefficients[1][0] * coefficients[2][1] - coefficients[1][1] * coefficients[2][0]))
        ) / determinant;

        return { x, y, z };
    }
});
