import React from 'react';

const UserAddedConfirmation = ({ name, status, onClick }: { name: string, status: string, onClick: () => void }) => {
  const renderIcon = () => {
    const iconClasses = "rounded-full p-2";
    switch (status) {
      case 'success':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconClasses} bg-green-500`}
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case 'already-exists':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconClasses} bg-yellow-500`}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'error':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconClasses} bg-red-500`}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nome registrado com sucesso
            </h2>
            <p className="text-gray-600 mb-6">
              <b>{name}</b> será incluído na próxima sessão de irradiação
            </p>
          </>
        );
      case 'already-exists':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nome já registrado
            </h2>
            <p className="text-gray-600 mb-6">
              O nome <b>{name}</b> já foi registrado anteriormente
            </p>
          </>
        );
      case 'error':
        return (
          <>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Ocorreu um problema ao registar o nome
            </h2>
            <p className="text-gray-600 mb-6">
              Um problema inesperado aconteceu ao tentar registrar esse nome, por favor tente novamente.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        <div className="inline-block mb-4">
          {renderIcon()}
        </div>
        {renderContent()}
        <button
          className={`px-6 py-2 rounded-md transition-colors ${status === 'success'
            ? 'bg-green-500 text-white hover:bg-green-600'
            : status === 'already-exists'
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          onClick={() => {
            onClick()
          }}
        >
          {status === 'success' ? 'Registrar outro nome'
            : status === 'already-exists' ? 'Voltar'
              : 'Tente denovo'}
        </button>
      </div>
    </div>
  );
};

export default UserAddedConfirmation;