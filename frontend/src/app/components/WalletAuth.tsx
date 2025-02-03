import React, { useState } from "react";

const WalletAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleWalletAuth = async () => {
    try {
      // ウォレット認証のロジックをここに追加
      // 例: MetaMask を使用した認証
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setIsAuthenticated(true);
        }
      } else {
        console.error("MetaMask がインストールされていません。");
      }
    } catch (error) {
      console.error("ウォレット認証に失敗しました:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>ウォレット認証に成功しました。</p>
      ) : (
        <button
          onClick={handleWalletAuth}
          className="p-2 bg-blue-500 text-white rounded"
        >
          ウォレット認証
        </button>
      )}
    </div>
  );
};

export default WalletAuth;
