// 16/10/2026

const employees = [
    { name: "John", salary: 50000, department: "IT" },
    { name: "Jane", salary: 60000, department: "HR" },
    { name: "Bob", salary: 55000, department: "IT" },
    { name: "Sophie", salary: 75000, department: "HR" },
    { name: "Mike", salary: 65000, department: "IT" },
    { name: "Emily", salary: 80000, department: "HR" },
    { name: "David", salary: 70000, department: "IT" }
];

const result = ["IT", "HR"]
    .map(department => {
        const members = employees.filter(
            e => e.department === department
        );

        const total = members.reduce(
            (sum, e) => sum + e.salary, 0
        );

        return {
            department,
            averageSalary: total / members.length
        };
    })
    .filter(dept => dept.averageSalary > 65000);

console.log(result);