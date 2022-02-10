from brownie import network, Decentragram
from scripts.utils import LOCAL_BLOCKCHAIN_ENVIROMENTS, get_account
from scripts.deploy import deploy_decentragram
import pytest


def test_deploy_successfully():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()

    account = get_account()

    decentragram = Decentragram[-1] if len(Decentragram) > 0 else deploy_decentragram()

    assert decentragram.owner() == account
