import { useAppDispatch } from "@redux/index";
import { Button, Collapse, Tabs, TabsProps } from "antd";
import ConfigSCM from "@utils/configs/scm-ui.json";
import { useMetaMask } from "metamask-react";
import Web3 from "web3";
import MainLayout from "@layouts/main.layout";
import SCMFunction from "@components/scm-function";
const { Panel } = Collapse;

declare global {
  interface Window {
    web3: Web3;
  }
}
export default function Home() {
  const dispatch = useAppDispatch();
  const { connect, status, ethereum } = useMetaMask();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = ConfigSCM.map((item) => {
    return {
      key: item.key,
      label: item.name,
      children: item?.functions?.length > 0 && (
        <Collapse defaultActiveKey={["1"]} onChange={onChange}>
          {item.functions?.map((func, index) => (
            <Panel header={func.name} key={index}>
              {func.type == "basic" && (
                <SCMFunction
                  configs={{
                    contract: func.contract,
                    method: func.method,
                    inputs: func.inputs as any,
                    outputs: func.outputs as any,
                    description: func.description,
                    btnSubmit: {
                      type: func.btnSubmit.type as any,
                      submitText: func.btnSubmit.submitText,
                    },
                  }}
                />
              )}
            </Panel>
          ))}
        </Collapse>
      ),
    };
  });

  return (
    <MainLayout>
      <main className="py-12">
        <div className="container">
          <div>
            <Button onClick={connect}>Connect to MetaMask</Button>
          </div>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </main>
    </MainLayout>
  );
}
