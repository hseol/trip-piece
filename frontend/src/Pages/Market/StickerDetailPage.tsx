import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";
import { motion } from "framer-motion";
import { BsFillCreditCardFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "../../utils/apis/api";
import { useQuery } from "react-query";
import {
  deleteRequest,
  IMarket,
} from "../../utils/interfaces/markets.interface";
import { marketApis } from "../../utils/apis/marketApis";
import { useRecoilState } from "recoil";
import { UserInfoState } from "../../store/atom";
import { MarketContract } from "../../utils/common/Market_ABI";
import spinner from "../../assets/image/spinner.gif";
import { NFTContract } from "../../utils/common/NFT_ABI";

const Container = styled.article`
  min-height: 90vh;
  padding: 0 5vw 0 5vw;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const StickerCard = styled.article`
  width: 100%;
  height: 55vh;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  img {
    display: block;
    width: 100%;
    height: 80%;
    padding: 10px;
    border-radius: 20px;
    object-fit: contain;
  }

  p {
    width: 100%;
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.h3};
    color: ${(props) => props.theme.colors.gray700};
    font-weight: bold;
  }
`;

const Price = styled.article`
  width: 100%;
  height: 12vh;
  padding-left: 5vw;
  padding-top: 3vh;
  p {
    width: 100%;
    font-size: ${(props) => props.theme.fontSizes.h3};
    color: ${(props) => props.theme.colors.white};
    padding-bottom: 1.5vh;
  }

  .price {
    width: 100%;
    font-size: ${(props) => props.theme.fontSizes.h3};
    color: ${(props) => props.theme.colors.yellow};
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-left: 1rem;

    p {
      width: 100%;
      font-size: ${(props) => props.theme.fontSizes.h3};
      color: ${(props) => props.theme.colors.white};
      padding-left: 1rem;
    }
  }
`;

const Button = styled.article`
  width: 100%;
  height: 10vh;
  padding: 1rem;

  button {
    width: 100%;
    height: 7vh;
    border-radius: 10px;
    font-size: ${(props) => props.theme.fontSizes.h5};
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    vertical-align: center;

    p {
      margin-left: 0.5rem;
    }
  }
`;

function StickerDetailPage() {
  const { marketId } = useParams();
  const [imagePath, setImagePath] = useState<string>();
  const [userInfo] = useRecoilState(UserInfoState);
  const [loading, setLoading] = useState<boolean>(false);
  const [mine, setMine] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data } = useQuery<AxiosResponse<IMarket>, AxiosError>(
    ["marketDetail"],
    () => axiosInstance.get(marketApis.getMarketDetail(marketId)),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
    },
  );

  const getImage = (tokenUrl: string): string => {
    fetch(`https://www.infura-ipfs.io/ipfs/${data?.data?.tokenURL}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setImagePath(data[0].image);
      });
    return imagePath;
  };

  const buySticker = async (e: { preventDefault: () => void }) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await MarketContract.methods
        .purchaseSticker(data.data.tokenId)
        .send({ from: userInfo.address, value: data?.data?.price });
      if (result.status) {
        deleteMarket({ data: { marketId: data.data.marketId } });
      }
      alert("구매가 완료되었습니다.");
      setLoading(false);
      navigate(-1);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const cancelSticker = async (e: { preventDefault: () => void }) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await MarketContract.methods
        .cancelSticker(data.data.tokenId)
        .send({ from: userInfo.address });
      if (result.status) {
        deleteMarket({ data: { marketId: data.data.marketId } });
        console.log("DB삭제완료");
      }
      alert("등록이 취소되었습니다.");
      setLoading(false);
      navigate(-1);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteMarket = async (data: deleteRequest) => {
    await axiosInstance
      .delete(marketApis.defaultURL, data)
      .then((response: { data: string }) => {
        console.log(response.data);
      });
  };

  useEffect(() => {
    if (data?.data?.userId == userInfo.id) setMine(true);
  }, [data]);

  const moveToBack = () => {
    navigate(-1);
  };
  getImage(data?.data?.tokenURL);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Helmet>
        <title>마켓 | 판매 스티커 상세 조회</title>
      </Helmet>
      <Container>
        <StickerCard>
          <img src={imagePath} />
          <p>{data?.data?.tokenName}</p>
        </StickerCard>
        {loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={spinner}
              style={{ width: "50%", height: "auto", textAlign: "center" }}
            />
          </div>
        )}
        {!loading && (
          <Price>
            <p>판매 가격</p>
            <div className="price">
              <FaEthereum />
              <p>{data?.data?.price}</p>
            </div>
          </Price>
        )}
        <Button>
          {mine && (
            <button onClick={cancelSticker}>
              <p>등록 취소</p>
            </button>
          )}
          {!mine && (
            <button onClick={buySticker}>
              <BsFillCreditCardFill />
              <p>구매</p>
            </button>
          )}
          <button style={{ marginTop: "5px" }} onClick={moveToBack}>
            <p>뒤로가기</p>
          </button>
        </Button>
      </Container>
    </motion.div>
  );
}

export default StickerDetailPage;
