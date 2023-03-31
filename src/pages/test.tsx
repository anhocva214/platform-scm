import SCMFunction from "@components/scm-function";
import MainLayout from "@layouts/main.layout";

export default function TestPage() {


  return (
    <MainLayout>
      <SCMFunction
        configs={{
          contract: 'account_manager',
          method: 'ownerCheck',
          inputs: [
            {
              fieldname: "address",
              name: "Address",
              type: "address",
              placeholder: "address",
              copy: true,
              rule: 'address'
            },
          ],
          outputs: [
            {
              fieldname: "",
              name: "Output",
              type: "text",
              placeholder: "Result",
            },
          ],
          description: "lorem ipsum dolor sit amet",
          btnSubmit: {
            type: "call",
            submitText: "getUpdate",
          },
        }}
      />
    </MainLayout>
  );
}
