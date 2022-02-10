from brownie import Decentragram, network, config
from scripts.utils import LOCAL_BLOCKCHAIN_ENVIROMENTS, get_account


def deploy_decentragram():
    account = get_account()
    decentragram = Decentragram.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    return decentragram


def main():
    deploy_decentragram()
