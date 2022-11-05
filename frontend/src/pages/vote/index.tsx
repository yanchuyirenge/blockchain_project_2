import React from 'react';
import $ from 'jquery'
import {Button, Image} from 'antd';
import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {voteContract, myERC20Contract, web3} from "../../utils/contracts";
import './index.css';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const VotePage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [start_amount, setStart_amount] = useState(0)
    const [vote_amount, setVote_amount] = useState(0)
    const [des, setDes] = useState<undefined | string>(undefined)
    const [num, setNum] = useState<undefined | string>(undefined)

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getvoteContractInfo = async () => {
            if (voteContract) {
	const sa = await voteContract.methods.START_AMOUNT().call()
                setStart_amount(sa)
	const va = await voteContract.methods.VOTE_AMOUNT().call()
                setVote_amount(va)
            } else {
                alert('Contract not exists.')
            }
        }

        getvoteContractInfo()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const onClaimTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have claimed ZJU Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onstart = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if(!des) {
            alert('请输入描述')
            return
        }

        if (voteContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(voteContract.options.address, start_amount).send({
                    from: account
                })

                await voteContract.methods.start(des).send({
                    from: account
                })

                alert('You have started the proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onfavor = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if(!num) {
            alert('请输入编号')
            return
        }

        if (voteContract && myERC20Contract) {
            try {
	var flag=await voteContract.methods.canvote(account, num).call()
	if(flag){
	    await myERC20Contract.methods.approve(voteContract.options.address, vote_amount).send({
                        from: account
                    })

                    await voteContract.methods.p_favor(num).send({
                        from: account
                    })
                    alert('You have favored the proposal.')
	}
	else{
	    alert('You cannot vote the proposal.')
	}
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onoppose = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if(!num) {
            alert('请输入编号')
            return
        }

        if (voteContract && myERC20Contract) {
            try {
	var flag=await voteContract.methods.canvote(account, num).call()
	if(flag){
	    await myERC20Contract.methods.approve(voteContract.options.address, vote_amount).send({
                        from: account
                    })

                    await voteContract.methods.p_oppose(num).send({
                        from: account
                    })
                    alert('You have opposed the proposal.')
	}
	else{
	    alert('You cannot vote the proposal.')
	}
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onrefresh = async () => {

        if (voteContract) {
            try {
	await voteContract.methods.refresh().send({
                    from: account
                })
	var result=await voteContract.methods.get().call()
                $("#tab").find('tr').remove();

                var $tab=$("<table></table>");
                var $tr=$("<tr></tr>");
                var $td=$("<td></td>");
                $td.html("编号   ");
                $tr.append($td);
                $td=$("<td></td>");
                $td.html("发起人   ");
                $tr.append($td);
                $td=$("<td></td>");
                $td.html("描述   ");
                $tr.append($td);
                $td=$("<td></td>");
                $td.html("赞成人数   ");
                $tr.append($td);
                $td=$("<td></td>");
                $td.html("反对人数   ");
                $tr.append($td);
                $td=$("<td></td>");
                $td.html("是否通过（1通过，2否决，0待定）   ");
                $tr.append($td);
                $td=$("<td></td>");
                $td.html("发起时间   ");
                $tr.append($td);

                $tab.append($tr);  
	var num=0; 
                for(var j=0;j<result.length;j++){
	    
                    $tr=$("<tr></tr>");
                    var str=String(result[j]).split(',');
                    $td=$("<td></td>");
                    $td.html(String(num++));
                    $tr.append($td);
                    for(var i=0;i<6;i++){
                        $td=$("<td></td>");
                        $td.html(str[i]);
                        $tr.append($td);
                    }
                    $tab.append($tr);
                }
                $("#tab").append($tab);
                alert('refresh!')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <React.Fragment>
        <div className='container'>
            <Image
                width='100%'
                height='150px'
                preview={false}
                src={Header}
            />
            <div className='main'>
                <h1>社团管理DEMO</h1>
                <Button onClick={onClaimTokenAirdrop}>领取浙大币空投</Button>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <div>当前用户拥有浙大币数量：{account === '' ? 0 : accountBalance}</div>
                </div>
                <div>花费{start_amount}浙大币，发起提议</div>
	<div>花费{vote_amount}浙大币，赞成/反对提议</div>
	<div>
                    <div>发起提议的描述: </div>
                    <input onChange={(e) => setDes(e.target.value)}/>
                </div>
	<div>
                    <div>投票提议的编号: </div>
                    <input onChange={(e) => setNum(e.target.value)}/>
                </div>
                <div className='operation'>
                    <div style={{marginBottom: '20px'}}>操作栏</div>
                    <div className='buttons'>
                        <Button style={{width: '200px'}} onClick={onstart}>发起</Button>
                        <Button style={{width: '200px'}} onClick={onfavor}>赞成</Button>
                        <Button style={{width: '200px'}} onClick={onoppose}>反对</Button>
                        <Button style={{width: '200px'}} onClick={onrefresh}>刷新</Button>
                    </div>
                </div>
            </div>
        </div>
        <div id="tab">
        </div>
        </React.Fragment>
    )
}

export default VotePage