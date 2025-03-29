import emailjs from "@emailjs/browser";

// Function to handle API Call execution
const executeApiCall = async (step) => {
  const apiCallWithBody = {
    method: step.method,
    headers: step.headers || {},
    body: JSON.stringify(step.body),
  };
  const apiCallWithoutBody = {
    method: step.method,
    headers: step.headers || {},
  };
  try {
    const response = await fetch(
      step.url,
      step.body !== "" ? apiCallWithBody : apiCallWithoutBody
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "API call failed");

    const successMessage = `✅ Email sent successfully!\n${JSON.stringify(
      data
    )}`;

    alert(successMessage);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to handle Email execution
const executeEmail = async (step) => {
  const templateParams = {
    from_name: "Sidramaraddy", // Sender's Name
    email: step.email, // Sender's Email
    subject: "Test Email from webflow test by Sidramaraddy",
    message:
      "This is a test email for webflow testing! created by Sidramaraddy M",
  };
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_APP_EMAIL_SERVICE_ID,
      import.meta.env.VITE_APP_EMAIL_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_APP_EMAIL_PUBLIC_KEY
    );
    const successMessage = `✅ Email sent successfully!\n
      📧 To: ${templateParams.email}\n
      📝 Subject: ${templateParams.subject}`;
    alert(successMessage);

    console.log(step.email);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Main execution function
export const executeWorkflow = async (workflow) => {
  for (const step of workflow) {
    let result;

    switch (step.type) {
      case "API Call":
        result = await executeApiCall(step);
        break;
      case "Email":
        result = await executeEmail(step);
        break;
      case "Text Box":
        console.log(`Text Output: ${step.body}`);
        result = { success: true };
        break;
      default:
        console.warn(`Unknown step type: ${step.type}`);
        result = { success: false, error: "Unknown step type" };
        break;
    }

    if (!result.success) {
      return { status: "Failed", message: result.error };
    }
  }

  return { status: "Passed", message: "All steps executed successfully" };
};
