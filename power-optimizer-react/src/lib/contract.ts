export const CONTRACT_ADDRESS = "0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5";

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "deviceAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ConsumptionDataUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "deviceAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "deviceType",
        "type": "string"
      }
    ],
    "name": "DeviceRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "deviceAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "savingsPercentage",
        "type": "uint256"
      }
    ],
    "name": "EnergyEfficiencyImproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "devices",
        "type": "address[]"
      }
    ],
    "name": "OptimizationCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "OptimizationAnalysisStarted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_deviceType",
        "type": "string"
      }
    ],
    "name": "registerDevice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_powerUsage",
        "type": "uint32"
      },
      {
        "internalType": "uint16",
        "name": "_efficiencyScore",
        "type": "uint16"
      }
    ],
    "name": "updateConsumptionData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startOptimizationAnalysis",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_totalLoad",
        "type": "uint32"
      }
    ],
    "name": "updateGridLoad",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "deviceAddr",
        "type": "address"
      }
    ],
    "name": "getDeviceInfo",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdateTime",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "deviceType",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      }
    ],
    "name": "getOptimizationRecommendation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "analysisCompleted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "analysisTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deviceCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSystemStats",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "totalRegisteredDevices",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "lastOptimizationTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentAnalysisId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isOptimizationActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentHour",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isOptimizationWindow",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPeakHour",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRegisteredDevicesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
