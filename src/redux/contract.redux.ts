import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/redux/reducer";
import ConfigContracts from "@utils/configs/contract.json";
import Web3 from "web3";
import Contract from "web3-eth-contract";

export const setupContracts = createAsyncThunk(
  "contract/setup",
  async (web3: Web3) => {
    const contractsArray = ConfigContracts.map((item) => {
      let contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(item.abi)),
        item.address
      );
      return {
        [item.name]: contract,
      };
    });
    return contractsArray.reduce((acc, curr, index) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
    }, {});
  }
);

export const setupWeb3 = createAsyncThunk(
  "contract/web3",
  async (web3: Web3) => {
    return web3;
  }
);

interface ContractState {
  contracts: {
    [x: string]: Contract;
  };
  web3: Web3;
}

export const initialState: ContractState = {
  contracts: {},
  web3: null,
};

export const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setupContracts.fulfilled, (state, { payload }) => {
      state.contracts = payload;
    });
    // .addCase(fetchUsers.fulfilled, (state, { payload }: PayloadAction<User[]>) => {
    //     state.getUsersLoading = false;
    //     state.users = payload
    // })
    // .addCase(fetchUsers.rejected, (state, {error}) => {
    //     console.log("🚀 ~ file: user.redux.ts ~ line 43 ~ .addCase ~ error", error)
    //     state.getUsersLoading = false;
    //     state.users = []
    // })

    builder.addCase(setupWeb3.fulfilled, (state, { payload }) => {
      state.web3 = payload;
    });
  },
});

export const contractReducer = contractSlice.reducer;
export const contractSelector = (state: RootState) => state.contract;
