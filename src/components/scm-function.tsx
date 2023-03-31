// import { contractActions, contractSelector } from "@redux/contract.redux";
import { contractSelector } from "@redux/contract.redux";
import { isAddress } from "@utils/functions";
import { message } from "antd";
import { useMetaMask } from "metamask-react";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleSpinner } from "react-spinners-kit";
import {
  IInputFunction,
  IOutputFunction,
  TRule,
} from "src/models/scm-function.model";
import { Contract } from "web3-eth-contract";

interface IProps {
  configs: {
    description?: string;
    contract: string;
    method: string;
    inputs: IInputFunction[];
    outputs: IOutputFunction[];
    btnSubmit?: {
      type: "send" | "call";
      submitText: string;
    };
  };
}

export default function SCMFunction({ configs }: IProps) {
  const dispatch = useDispatch<any>();

  const { contracts } = useSelector(contractSelector);
  const { account, status } = useMetaMask();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [output, setOutput] = useState(null);
  const [errorsValidate, setErrorsValidate] = useState({});

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let _form = { ...form };
    _form[e.target.name] = e.target.value;
    setForm(_form);
  };

  const validateForm = (
    data: object,
    rules: { fieldname: string; rule: TRule }[]
  ) => {
    let errors = {};
    rules.forEach((item) => {
      let value = data[item.fieldname] || "";
      if (item.rule == "require" && !value) {
        errors[item.fieldname] = "This information is required";
      } else if (item.rule == "address" && !isAddress(value)) {
        errors[item.fieldname] = "Invalid address";
      } else if (item.rule == "numeric" && (isNaN(value) || !value)) {
        errors[item.fieldname] = "This information must be numeric";
      }
    });
    if (Object.keys(errors).length > 0) {
      return errors;
    } else return null;
  };

  const submit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(status == 'connected')) {
      message.error("You must be connected to the MetaMask")
      return;
    }

    setLoading(true)

    setErrorsValidate({});
    let errors = validateForm(
      form,
      configs.inputs.map((item) => {
        return {
          fieldname: item.fieldname,
          rule: item.rule,
        };
      })
    );

    if (errors) {
      console.log("🚀 ~ file: scm-function.tsx:81 ~ submit ~ errors:", errors);
      setErrorsValidate(errors);
      return;
    }

    try {
      // console.log("contracts: ", contracts)
      let _output = await contracts[configs.contract].methods[configs.method](
        ...configs.inputs.map((item) => {
          return form[item.fieldname];
        })
      )?.[configs.btnSubmit.type]?.({ from: account });
      // console.log("🚀 ~ file: scm-function.tsx:90 ~ submit ~ output:", output);
      setOutput(_output);
    } catch (err) {
      console.log(err);
      if (err?.message) {
        message.error(err.message);
      } else {
        message.error("Ops Something went wrong")
      }
      setOutput(null);
    }
    finally{
      message.success("Successfully")
    }

    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="text-base flex flex-col gap-2">
      {configs.inputs.map((item) => {
        return (
          <div>
            <div className="relative flex items-center gap-2">
              <span className="bg-gray-500 items-center justify-center font-semibold text-white h-[50px] w-44 flex rounded-md ">
                {item.name}
              </span>
              <input
                className="outline-0 bg-neutral-100 border border-neutral-300 w-full py-3 px-4 rounded-md"
                type="text"
                placeholder={item?.placeholder}
                name={item.fieldname}
                onChange={onChange}
                value={form[item.fieldname]}
              />
              {item.copy && (
                <a
                  role="button"
                  onClick={() =>
                    navigator.clipboard.writeText(form[item.fieldname])
                  }
                  className="text-2xl absolute text-gray-400 top-1/2 right-2 -translate-y-1/2 hover:text-black"
                >
                  <i className="fa-duotone fa-copy"></i>
                </a>
              )}
            </div>
            {errorsValidate[item.fieldname] && (
              <span className="italic text-red-500">
                <i className="fa-sharp fa-solid fa-circle-exclamation"></i>{" "}
                {errorsValidate[item.fieldname]}
              </span>
            )}
          </div>
        );
      })}
      {configs.outputs.map((item) => {
        return (
          <div className="relative flex items-center gap-2">
            <span className="bg-transparent items-center justify-center font-semibold text-gray-500 h-[50px] w-44 flex rounded-md ">
              {item.name}
            </span>
            <input
              className="outline-0 bg-neutral-100 border border-neutral-300 w-full py-3 px-4 rounded-md"
              type="text"
              value={item.fieldname ? output?.[item.fieldname] : output}
              disabled
            />
            {item.copy && (
              <a
                role="button"
                onClick={() =>
                  navigator.clipboard.writeText(form[item.fieldname])
                }
                className="text-2xl absolute text-gray-400 top-1/2 right-2 -translate-y-1/2 hover:text-black"
              >
                <i className="fa-duotone fa-copy"></i>
              </a>
            )}
          </div>
        );
      })}

      <div className="flex justify-between mt-2 gap-10">
        <p className="text-zinc-500 italic ">{configs?.description}</p>
        {configs?.btnSubmit && (
          <button
            className={`${
              configs.btnSubmit.type == "send"
                ? "bg-amber-500 hover:bg-amber-400"
                : "bg-sky-600 hover:bg-sky-500"
            } w-44 py-2 rounded-lg transition-all duration-300 flex gap-2 justify-center items-center disabled:bg-gray-500`}
          >
            <span className="text-white font-semibold">
              {configs.btnSubmit.submitText}
            </span>
            <CircleSpinner loading={loading} size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
