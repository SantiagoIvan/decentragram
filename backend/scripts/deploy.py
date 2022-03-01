from brownie import Decentragram, accounts, network, config
from scripts.utils import LOCAL_BLOCKCHAIN_ENVIROMENTS, get_account


def deploy_decentragram():
    account = get_account()
    decentragram = Decentragram.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    return decentragram


def upload_post():
    account = get_account()
    decentragram = Decentragram[-1]

    for i in range(15):
        decentragram.uploadPost(
            "QmbqNoc7AjAwh5aB78ZnzaxGW37K149JfEEcyykJxAc2ft",
            "here is a picture from my last application!",
            {"from": account},
        )


def main():
    deploy_decentragram()
